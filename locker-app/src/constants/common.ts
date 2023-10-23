export const PAYMENT_POLLING_INTERVAL = 2_000;
export const LOCKER_INFO_POLLING_INTERVAL = 2_000;
export const VN_PAY_MINIMUM_PAYMENT_ACCEPTANCE = 10_000;
export const SCREEN_WAITING_TIMEOUT = 5 * 60;

export const LOCAL_STORAGE_ITEMS = Object.freeze({
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  BASE_URL: "baseUrl",
  API_KEY: "apiKey",
  LOCKER_ID: "lockerId",
});

export const PATH = {
  HOME: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  SEND: "/send",
  RECEIVE: "/receive",
  RESERVE: "/reserve",
  PROCESS: "/process",
  RETURN: "/return",
  SETUP: "/setup",
  MAINTAINING: "/maintaining",
  OFFLINE: "/offline",
};
