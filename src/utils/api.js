const JSON_HEADER= {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  import {SERVER_URL} from '../config/server';

async function get(endpoint,data){
    //Prefix endpoint with '/';
const response = await fetch(`${SERVER_URL}${endpoint}`, {
    method: 'GET',
    headers:JSON_HEADER,
  })
  let result = await response.json();
  return result;
   
}

async function post(endpoint, data){
    const response = await fetch(`${SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers:JSON_HEADER,
        body: JSON.stringify(data),
      })
      let result = await response.json();
      return result;
}


export {post, get};