import { SERVICE_STATUS, type IService } from "@/interfaces/service";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import { PAGE_SIZE_SERVICES } from "@/constants/common";
import endpoints from "@/constants/endpoints";
import { IPaging } from "@/interfaces";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Service"],
  endpoints: (build) => ({
    services: build.query<IService, Partial<IPaging> & { lockerId: number }>({
      query: ({ lockerId, ...params }) => ({
        url: endpoints.getServiceEndpoints().services,
        method: "GET",
        params: {
          status: SERVICE_STATUS.ACTIVE,
          pageSize: PAGE_SIZE_SERVICES,
          pageNumber: params?.pageNumber,
          lockerId: lockerId,
        },
      }),
      providesTags: [{ type: "Service", id: "LIST" }],
    }),
  }),
});

export const { useServicesQuery } = serviceApi;
