const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const MONITOR_TOKEN_KEY = 'monitorToken';
const MONITOR_REFRESH_TOKEN_KEY = 'monitorRefreshToken';

const isLogin = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

const setMonitorToken = (token: string) => {
  localStorage.setItem(MONITOR_TOKEN_KEY, token);
};

const setMonitorRefreshToken = (token: string) => {
  localStorage.setItem(MONITOR_REFRESH_TOKEN_KEY, token);
};

const getMonitorToken = () => {
  return localStorage.getItem(MONITOR_TOKEN_KEY);
};

const getMonitorRefreshToken = () => {
  return localStorage.getItem(MONITOR_REFRESH_TOKEN_KEY);
};

const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(MONITOR_TOKEN_KEY);
  localStorage.removeItem(MONITOR_REFRESH_TOKEN_KEY);
};

export {
  isLogin,
  getToken,
  setToken,
  clearToken,
  setRefreshToken,
  getRefreshToken,
  setMonitorRefreshToken,
  setMonitorToken,
  getMonitorRefreshToken,
  getMonitorToken,
};
