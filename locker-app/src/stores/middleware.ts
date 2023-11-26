import { authApi } from "@/services/authService";
import { boardApi } from "@/services/boardService";
import { boxApi } from "@/services/boxService";
import { customerApi } from "@/services/customerService";
import { addressApi } from "@/services/addressService";
import { lockerApi } from "@/services/lockerService";
import { orderApi } from "@/services/orderService";
import { serviceApi } from "@/services/serviceService";
import { settingApi } from "@/services/settingService";
import { geolocationApi } from "@/services/geolocationService";

export const middleware = [
  boxApi.middleware,
  orderApi.middleware,
  customerApi.middleware,
  serviceApi.middleware,
  lockerApi.middleware,
  authApi.middleware,
  boardApi.middleware,
  settingApi.middleware,
  addressApi.middleware,
  geolocationApi.middleware,
];
