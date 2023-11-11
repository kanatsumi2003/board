import { LOCAL_STORAGE_ITEMS } from "./common";

// const BASE_URL = import.meta.env.VITE_API_LOCKER || "";
const BOARD_URL = import.meta.env.VITE_API_BOARD || "";
const BASE_URL = `${localStorage.getItem(LOCAL_STORAGE_ITEMS.BASE_URL)}/api/v1`;
const BASE_URL_LOCKER = BASE_URL + "/lockers";
const BASE_URL_CUSTOMER = BASE_URL + "/customers";
const BASE_URL_ORDER = BASE_URL + "/orders";
const BASE_URL_DASHBOARD = BASE_URL + "/dashboard";
const BASE_URL_ADDRESS = BASE_URL + "/addresses";
const BASE_URL_SETTING = BASE_URL + "/settings";
const BASE_URL_AUTH = BASE_URL + "/auth";
const BASE_URL_FILE = BASE_URL + "/file";
const BASE_URL_SERVICE = BASE_URL + "/services";
const BASE_URL_STAFF = BASE_URL + "/staffs";
const BASE_URL_STORE = BASE_URL + "/stores";
const BASE_URL_PAYMENT = BASE_URL + "/payments";

const getBoardEndpoints = () => {
  return {
    board: `${BOARD_URL}`,
    boardInfo: `${BOARD_URL}/info`,
    boardCheckBoxes: `${BOARD_URL}/check-boxes`,
  };
};

const getAuthEndPoints = () => {
  const ADMIN_AUTH_URL = BASE_URL_AUTH + "/admin";
  const STAFF_AUTH_URL = BASE_URL_AUTH + "/staff";

  return {
    staffLogin: `${STAFF_AUTH_URL}/login`,
    staffProfile: `${STAFF_AUTH_URL}/profile`,
    refreshToken: `${BASE_URL_AUTH}/refresh`,
  };
};

const getStoreEndpoints = (id?: number) => {
  return {
    stores: `${BASE_URL_STORE}`,
    storeById: `${BASE_URL_STORE}/${id}`,
    storeByIdStatus: `${BASE_URL_STORE}/${id}/status`,
  };
};

const getLockerEndpoints = (id?: number) => {
  return {
    lockers: `${BASE_URL_LOCKER}`,
    lockerById: `${BASE_URL_LOCKER}/${id}`,
    lockerWithStaffs: `${BASE_URL_LOCKER}/${id}/staffs`,
    lockerByIdStatus: `${BASE_URL_LOCKER}/${id}/status`,
    lockerByIdBoxes: `${BASE_URL_LOCKER}/${id}/boxes`,
    lockerByIdBoxToken: `${BASE_URL_LOCKER}/${id}/boxes/token`,
    lockerByIdTimelines: `${BASE_URL_LOCKER}/${id}/timelines`,
    lockerByIdStatistics: `${BASE_URL_LOCKER}/${id}/statistics`,
  };
};
const getCustomerEndpoints = (id?: number) => {
  return {
    customerByPhone: `${BASE_URL_CUSTOMER}/by-phone`,
  };
};

const getHardwareEndpoints = (id: number, hardwareId?: number) => {
  return {
    hardwares: `${BASE_URL_LOCKER}/${id}/hardwares`,
    hardwareById: `${BASE_URL_LOCKER}/${id}/hardwares/${hardwareId}`,
  };
};

const getServiceEndpoints = (id?: number) => {
  return {
    services: `${BASE_URL_SERVICE}`,
  };
};

const getOrderEndpoints = (id?: number, pinCode?: string) => {
  return {
    orders: `${BASE_URL_ORDER}`,
    orderById: `${BASE_URL_ORDER}/${id}`,
    orderConfirm: `${BASE_URL_ORDER}/${id}/confirm`,
    orderCheckout: `${BASE_URL_ORDER}/${id}/checkout`,
    orderProcess: `${BASE_URL_ORDER}/${id}/process`,
    collectOrder: `${BASE_URL_ORDER}/${id}/collect`,
    orderReturn: `${BASE_URL_ORDER}/${id}/return`,
    orderReservation: `${BASE_URL_ORDER}/${id}/reservation`,
    orderAddMore: `${BASE_URL_ORDER}/${id}/add-more`,
    orderByPinCode: `${BASE_URL_ORDER}/pin-code/${pinCode}`,
  };
};
const getPaymentEndpoints = (id?: number) => {
  return {
    paymentById: `${BASE_URL_PAYMENT}/${id}`,
  };
};

const getAddressEndpoints = () => {
  return {
    addresses: BASE_URL_ADDRESS,
  };
};
const getSettingEndpoints = () => {
  return {
    setting: BASE_URL_SETTING,
  };
};

const getStaffEndpoints = () => {
  return {
    staff: `${BASE_URL_STAFF}`,
    staffById: (id: number) => `${BASE_URL_STAFF}/${id}`,
    staffByIdStatus: (id: number) => `${BASE_URL_STAFF}/${id}/status`,
  };
};

const getDashboardEndPoints = () => {
  return {
    overview: `${BASE_URL_DASHBOARD}/overview`,
    stores: `${BASE_URL_DASHBOARD}/stores`,
    revenue: `${BASE_URL_DASHBOARD}/revenue`,
    lockers: `${BASE_URL_DASHBOARD}/lockers`,
    lockerLocations: `${BASE_URL_DASHBOARD}/lockers/locations`,
    orders: `${BASE_URL_DASHBOARD}/orders`,
  };
};

const endpoints = {
  getAuthEndPoints,
  getStoreEndpoints,
  getCustomerEndpoints,
  getLockerEndpoints,
  getHardwareEndpoints,
  getServiceEndpoints,
  getOrderEndpoints,
  getAddressEndpoints,
  getBoardEndpoints,
  getStaffEndpoints,
  getDashboardEndPoints,
  getSettingEndpoints,
  getPaymentEndpoints,
};

export default endpoints;
