import { LOCAL_STORAGE_ITEMS } from '@/constants/common';

const getAccessToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_ITEMS.ACCESS_TOKEN);
};

const updateAccessToken = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.ACCESS_TOKEN, token);
};

const setAccessToken = (token: string) => {
  localStorage.setItem(LOCAL_STORAGE_ITEMS.ACCESS_TOKEN, token);
};

const getRefreshToken = () => {
  return localStorage.getItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN);
};

const updateRefreshToken = (token: string) => {
  return localStorage.setItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN, token);
};

const setRefreshToken = (token: string) => {
  return localStorage.setItem(LOCAL_STORAGE_ITEMS.REFRESH_TOKEN, token);
};

const clearToken = () => {
  return localStorage.clear();
};

const TokenService = {
  getAccessToken,
  updateAccessToken,
  setAccessToken,
  getRefreshToken,
  updateRefreshToken,
  setRefreshToken,
  clearToken,
};

export default TokenService;
