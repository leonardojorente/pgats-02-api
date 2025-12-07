import http from 'k6/http';
import { BASE_URL } from './baseURL.js';

/**
 * Realiza o login e retorna apenas o token JWT.
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {string} token JWT
 */
export function login(username, password) {
    const res = http.post(`${BASE_URL}/users/login`, JSON.stringify({ username, password }), {
        headers: { "Content-Type": "application/json" }
    });
    return res;
}
