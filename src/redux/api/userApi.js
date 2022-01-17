import AsyncStorage from '@react-native-community/async-storage';
import {SERVER_URL, FETCH_HEADER_CONFIG} from '../../config/server';
import { post } from '../../utils/api';
// const POST_CONFIG = (payload) => ({
//       method: 'POST',
//       headers: FETCH_HEADER_CONFIG,
//       body: JSON.stringify(payload),
// })

const logInUser = (payload) =>{
      // return new Promise((res, rej)=>{
      //       fetch(`${SERVER_URL}/mobile/login`, {...POST_CONFIG(payload)})
      //        .then((resp) => res(resp.json()))
      // }) 
      return post('/mobile/login', payload);
  
}

const registerUser = (payload) =>{
      // return new Promise((res, rej)=>{
      //       fetch(`${SERVER_URL}/mobile/login`, {...POST_CONFIG(payload)})
      //        .then((resp) => res(resp.json()))
      // }) 
      return post('/mobile/login', payload);
  
}


const logOut = async (payload) =>{
      // return new Promise((res, rej)=>{
      //       fetch(`${SERVER_URL}/mobile/login`, {...POST_CONFIG(payload)})
      //        .then((resp) => res(resp.json()))
      // }) 
      // return post('/mobile/login', payload);


  
}

const forgotPassword = (payload) =>{
      // return new Promise((res, rej)=>{
      //       fetch(`${SERVER_URL}/mobile/login`, {...POST_CONFIG(payload)})
      //        .then((resp) => res(resp.json()))
      // }) 
      return post('/mobile/forgot_password_post', payload);
  
}

export { logInUser, registerUser, forgotPassword, logOut  }
    
