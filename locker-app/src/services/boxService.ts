import type { IBoxItem } from "@/interfaces/box";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";

export const boxApi = createApi({
  reducerPath: "boxApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Box"],
  endpoints: (build) => ({
    boxes: build.query<IBoxItem[], { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getLockerEndpoints(id).lockerByIdBoxes,
        method: "GET",
      }),
      providesTags: [{ type: "Box" }],
    }),
  }),
});

export const { useLazyBoxesQuery } = boxApi;
