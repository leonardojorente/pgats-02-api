import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend } from "k6/metrics";
import { generateUsername, generatePassword } from "./helpers/randomData.js";
import { login } from "./helpers/login.js";
import { BASE_URL } from "./helpers/baseURL.js";
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function() {
  return JSON.parse(open('./data/register-user.json'));
});

export let options = {
    vus: 3,
    //iterations: 1,
    stages: [
    { duration: '3s', target: 10 },    // Ramp-up
    { duration: '10s', target: 10 },   // avarage
    { duration: '2s', target: 100 },   // spike to 100 VUs
    { duration: '3s', target: 100 },   // spike to 100 VUs
    { duration: '5s', target: 10 },    // avarage
    { duration: '5s', target: 0 },     // ramp down
  ],
    thresholds: {
        http_req_duration: ["p(95)<2000"],
    },
};

const listUsersTrend = new Trend("list_users_duration");

export default function () {
    const user = users[(__VU - 1) % users.length]; // permite mais VUs que itens no json
    let username, password, token;

    group("Registrar usuário", function () {
        username = generateUsername(user.username);
        password = generatePassword();

        const payload = JSON.stringify({ username, password, favorecidos: [] });

        const res = http.post(`${BASE_URL}/users/register`, payload, {
            headers: { "Content-Type": "application/json" },
        });

        check(res, {
            "register status is 201": (r) => r.status === 201,
        });
    });

    group("Login do usuário", function () {
        const res = login(username, password);

        check(res, {
            "login status is 200": (r) => r.status === 200,
            "login returns token": (r) => r.json("token") !== undefined,
        });

        token = res.json("token");
    });

    group("Listar usuários", function () {
        const res = http.get(`${BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        listUsersTrend.add(res.timings.duration);

        check(res, {
            "list users status is 200": (r) => r.status === 200,
            "user is in list": (r) => r.json().some((u) => u.username === username),
        });
    });
    sleep(1);
}
