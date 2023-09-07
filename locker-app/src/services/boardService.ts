import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQueryBoard from "@/configs/axiosBaseQueryBoard";
import endpoints from "@/constants/endpoints";
import { ICheckBoxesResponse, ILockerInfoResponse } from "@/interfaces/locker";
("@/configs/axiosBaseQueryBoard");

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: axiosBaseQueryBoard(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Board"],
  endpoints: (build) => ({
    lockerInfo: build.query<ILockerInfoResponse, void>({
      query: () => ({
        url: endpoints.getBoardEndpoints().boardInfo,
        method: "GET",
      }),
      providesTags: [{ type: "Board" }],
    }),

    checkBoxes: build.query<ICheckBoxesResponse, void>({
      query: () => ({
        url: endpoints.getBoardEndpoints().boardCheckBoxes,
        method: "GET",
      }),
      providesTags: [{ type: "Board" }],
    }),
  }),
});

export const {
  useLockerInfoQuery,
  useLazyLockerInfoQuery,
  useLazyCheckBoxesQuery,
} = boardApi;
