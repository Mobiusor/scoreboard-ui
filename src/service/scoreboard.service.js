import axios from 'axios';
import { message } from 'antd';

const instance = axios.create({
  baseURL: 'http://www.dalingtao.xyz:8080',
  timeout: 1000,
});


instance.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')
  config.headers.jwt = token
  return config
});

instance.interceptors.response.use(response => {
  if (response.data.success === false) {
    message.error(response.data.data)
    throw new Error('ApiFailed')
  }
  response.data = response.data.data
  return response
})

const getUserMatches = async (startTime, endTime) => {
  const response = await instance.get('/user/match', {
    params: { startTime, endTime }
  });
  return response.data
};

const getMatches = async (startTime, endTime) => {
  const response = await instance.get('/match', {
    params: { startTime, endTime }
  });
  return response.data;
}

const getRank = async () => {
  // return rank;
  const response = await instance.get('/rank');
  return response.data;
}

const getUsers = async () => {
  const response = await instance.get('/user/');
  const data =  response.data;
  const userMap = new Map();
  data.forEach(x => userMap[x.userid] = x)
  return userMap;
}

const getSelfInfo = async (id) => {
  const response = await instance.get(`/user/self`);
  return response.data;
}

const updateUser = async (id, userProfile) => {
  const response = await instance.post(`/user/${id}`, userProfile);
  return response.data;
}

const login = async (alias, password) => {
  const response = await instance.post(`/user/login`, { alias, password });
  return response.data;
}

const addMatch = async (matches) => {
  const response = await instance.post('/match/', matches)
  return response.data;
}

export {
  getUserMatches,
  getMatches,
  getRank,
  getUsers,
  getSelfInfo,
  updateUser,
  login,
  addMatch
};