export const PAYMENT_POLLING_INTERVAL = 2_000;
export const LOCKER_INFO_POLLING_INTERVAL = 2_000;
export const VN_PAY_MINIMUM_PAYMENT_ACCEPTANCE = 10_000;
export const SCREEN_WAITING_TIMEOUT = 5 * 60;
export const PAGE_SIZE_ORDERS = 3;
export const PAGE_SIZE_BOXES = 6;
export const PAGE_SIZE_SERVICES = 3;

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
  ADD_MORE: "/add-more",
  PROCESS: "/process",
  OVERTIME: "/overtime",
  BOXES: "/boxes",
  RETURN: "/return",
  OPEN_BOX: "/open-box",
  SETUP: "/setup",
  MAINTAINING: "/maintaining",
  OFFLINE: "/offline",
  CONTACT: "/contact",
};

export const STAFF_PATHS = [
  PATH.DASHBOARD,
  PATH.OPEN_BOX,
  PATH.RETURN,
  PATH.PROCESS,
  PATH.BOXES,
];
