import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  vus: 20, // Virtual Users
  duration: '120s', // Duration of the test
};

export default function () {
  const payload = JSON.stringify({
    title: "Title1",
    description: "Description 1",
    attachmentsIds: []
  })

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  let res = http.post('http://localhost:3333/tasks', payload, params); 
  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}