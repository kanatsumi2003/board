import { combineReducers } from "@reduxjs/toolkit";

import { authApi } from "@/services/authService";
import { boardApi } from "@/services/boardService";
import { boxApi } from "@/services/boxService";
import { customerApi } from "@/services/customerService";
import { lockerApi } from "@/services/lockerService";
import { orderApi } from "@/services/orderService";
import { serviceApi } from "@/services/serviceService";
import globalReducer from "./global.store";
import lockerReducer from "./locker.store";
import orderReducer from "./order.store";
import userReducer from "./user.store";
import settingReducer from "./setting.store";
import { settingApi } from "@/services/settingService";
import { addressApi } from "@/services/addressService";

const rootReducer = combineReducers({
  global: globalReducer,
  user: userReducer,
  order: orderReducer,
  locker: lockerReducer,
  setting: settingReducer,
  [serviceApi.reducerPath]: serviceApi.reducer,
  [boxApi.reducerPath]: boxApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [lockerApi.reducerPath]: lockerApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [boardApi.reducerPath]: boardApi.reducer,
  [settingApi.reducerPath]: settingApi.reducer,
  [addressApi.reducerPath]: addressApi.reducer,
});

export default rootReducer;
