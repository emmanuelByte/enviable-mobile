import {SERVER_URL, FETCH_HEADER_CONFIG} from '../config/server';
const POST_CONFIG = (payload) => ({
      method: 'POST',
      headers: FETCH_HEADER_CONFIG,
      body: JSON.stringify(payload),
})

const logInUser = (payload) =>{
      return new Promise((res, rej)=>{
            fetch(`${SERVER_URL}/mobile/login`, {...POST_CONFIG(payload)})
             .then((resp) => res(resp.json()))
      }) 
  
}

export { logInUser }
    
