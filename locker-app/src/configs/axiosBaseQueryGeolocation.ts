import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import axiosClient from "./axiosClient";

export type BaseQueryError = { code?: number; message: any };

const axiosBaseQueryGeolocation =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
    },
    unknown,
    BaseQueryError
  > =>
  async ({ url, method, data, params }) => {
    try {
      const result = await axiosClient({
        url,
        method,
        data,
        params,
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      return {
        error: {
          code: err.response?.status,
          message: err.response?.data || err.message,
        },
      };
    }
  };

export default axiosBaseQueryGeolocation;
