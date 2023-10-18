import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosError, AxiosRequestConfig } from "axios";

import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import axiosClient from "./axiosClient";
import { LOCAL_STORAGE_ITEMS } from "@/constants/common";

export type BaseQueryError = { code?: number; message: any };

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: AxiosRequestConfig["data"];
      params?: AxiosRequestConfig["params"];
      headers?: AxiosRequestConfig["headers"];
    },
    unknown,
    BaseQueryError
  > =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await axiosClient({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          "x-api-key": localStorage.getItem(LOCAL_STORAGE_ITEMS.API_KEY),
          lockerId: localStorage.getItem(LOCAL_STORAGE_ITEMS.LOCKER_ID),
        },
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

export default axiosBaseQuery;
