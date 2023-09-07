import { SERVICE_STATUS } from "@/interfaces/service";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import { ISettingItem } from "@/interfaces/setting";
import endpoints from "@/constants/endpoints";

export const settingApi = createApi({
  reducerPath: "settingApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Setting"],
  endpoints: (build) => ({
    setting: build.query<ISettingItem, void>({
      query: () => ({
        url: endpoints.getSettingEndpoints().setting,
        method: "GET",
      }),
      providesTags: [{ type: "Setting" }],
    }),
  }),
});

export const { useSettingQuery } = settingApi;
