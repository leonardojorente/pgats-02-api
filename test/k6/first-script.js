import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
  vus: 1,
  iterations: 1, 
  thresholds: {
    http_req_duration: ['p(90)<=20', 'p(95)<=30'],
    //http_req_failed: ['rate<0.01']
  }
};

export default function() {
  let responseInstructorLogin = '';
  group('Doing login', function() {
    responseInstructorLogin = http.post(
      'http://localhost:3000/users/login',
      JSON.stringify({
        username: 'julio',
        password: '123456'
      }),
      { 
        headers: { 
          'Content-Type': 'application/json' 
        } 
    });
  });
  //console.log(responseInstructorLogin.json('token'));
  //console.log(responseInstructorLogin.body);

  group('Execute failure transfer', function() {
    const responseTransfer = http.post(
      'http://localhost:3000/transfers',
      JSON.stringify({
        from: "julio",
        to: "priscila",
        value: 100
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${responseInstructorLogin.json('token')}`
        } 
    });
    //console.log(responseTransfer);

    check(responseTransfer, { 
        "status is 201": (res) => res.status === 201,
        "status text must be 201 created": (res) => res.status_text === "201 Created"
    });
  });

  group('Simulate user think time', function() {
    sleep(1); 
  });
}
