import type { IBoxItem } from "@/interfaces/box";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { ITokenItem } from "@/interfaces/token";

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
    boxToken: build.mutation<ITokenItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getLockerEndpoints(id).lockerByIdBoxToken,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Box" }],
    }),
  }),
});

export const { useLazyBoxesQuery, useBoxTokenMutation } = boxApi;
