import type { AxiosResponse } from "axios";

import axios from "axios";

import TokenService from "@/services/tokenService";
import endpoints from "@/constants/endpoints";

const axiosClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config: any) => {
  const token = TokenService.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    const refreshTokenUrl = endpoints.getAuthEndPoints().refreshToken;

    if (originalConfig.url !== refreshTokenUrl && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;

        try {
          const refreshToken = TokenService.getRefreshToken();

          const res = await axiosClient.post(refreshTokenUrl, { refreshToken });

          TokenService.updateAccessToken(res.data.accessToken);
          TokenService.updateRefreshToken(res.data.refreshToken);

          return axiosClient(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }

    return Promise.reject(err);
  }
);
export default axiosClient;
