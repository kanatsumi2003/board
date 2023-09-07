import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import { ILockerItem } from "@/interfaces/locker";
import endpoints from "@/constants/endpoints";

export const lockerApi = createApi({
  reducerPath: "lockerApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Locker"],
  endpoints: (build) => ({
    locker: build.query<ILockerItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getLockerEndpoints(id).lockerById,
        method: "GET",
      }),
      providesTags: [{ type: "Locker" }],
    }),
  }),
});

export const { useLockerQuery } = lockerApi;
