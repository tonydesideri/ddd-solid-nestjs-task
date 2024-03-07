import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  vus: 20, // Virtual Users
  duration: '30s', // Duration of the test
};

// Função para criar uma nova task
function createTask() {
  
}

function getTask(taskId) {
  
}

// Função para cadastrar um comment em uma task existente
function createComment(taskId) {
  
}

export default function () {
  let payload = JSON.stringify({ 
    title: "faker.name()",
    description: "faker.name()", 
    attachmentsIds: []
  });

  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  http.post('http://localhost:3333/tasks', payload, params);
  sleep(1);


  const response = http.get('http://localhost:3333/tasks?page=1');

  const taskId = response.json().tasks[0].taskId
  console.log(taskId)
  sleep(1);
  

  let payload2 = JSON.stringify({ 
    taskId: "9894894d-eaa8-4860-84fd-b6dbaf71fddf", 
    content: "faker.name()",
    attachmentsIds: []
  });
  
  http.post('http://localhost:3333/comments', payload2, params);
  http.post('http://localhost:3333/comments', payload2, params);
  const res = http.post('http://localhost:3333/comments', payload2, params); 
  check(res, {
    'status is 201': (r) => r.status === 201,
  });
  sleep(1);
}