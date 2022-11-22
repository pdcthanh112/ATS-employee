import axios from 'axios';
import queryString from 'query-string';
import { useSelector, useDispatch } from 'react-redux'


// Set up default config for http requests here
const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, 
  headers: {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
  paramsSerializer: params => queryString.stringify(params),
});

axios.interceptors.request.use((config) => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  config.headers.authorization = currentUser.token;
  return config;
}, (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use((response) => {
  //   if (response && response.data) {
  //     return response;
  //   }

  return response;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;