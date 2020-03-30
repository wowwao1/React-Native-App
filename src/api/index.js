import { APPURL } from '../utils/constants';

export const sendRequest = async (method = "POST", data) => {
  let param = {
    method: method,
    headers: {
      Accept: 'application/json'
    },
    body: data
  };
  console.log('App Url : ', APPURL);
  let res = await fetch(APPURL, param);
  return await res.json();
}
export const userForgotPassword = async (method = "POST", data) => {
  console.log('user forgot password called....');
  console.log(data);
  let param = {
    method: method,
    headers: {
      Accept: 'application/json',
      //'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: data
  };

  let res = await fetch(APPURL, param);
  return await res.text();
}

export const userConversation = async (method = "POST", data) => {
  let param = {
    method: method,
    // headers: { 
    //   Accept: 'application/json',
    //   //'Content-Type': 'application/x-www-form-urlencoded'
    // },
    body: data
  };

  let res = await fetch(APPURL, param)

  return await res.json();
}
