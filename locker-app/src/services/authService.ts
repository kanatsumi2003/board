import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import { IStaffItem, IStaffLoginRequest } from "@/interfaces/account";
import { IAuthItem } from "@/interfaces/auth";
import endpoints from "@/constants/endpoints";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Auth"],
  endpoints: (build) => ({
    loginStaff: build.mutation<IAuthItem, IStaffLoginRequest>({
      query: ({ ...data }) => ({
        url: endpoints.getAuthEndPoints().staffLogin,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Auth" }],
    }),

    staffProfile: build.query<IStaffItem, void>({
      query: () => ({
        url: endpoints.getAuthEndPoints().staffProfile,
        method: "GET",
      }),
      providesTags: [{ type: "Auth" }],
    }),
  }),
});

export const { useLoginStaffMutation, useLazyStaffProfileQuery } = authApi;
