import { SERVICE_STATUS, type IService } from "@/interfaces/service";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IPaging } from "@/interfaces";

export const serviceApi = createApi({
  reducerPath: "serviceApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Service"],
  endpoints: (build) => ({
    services: build.query<IService, Partial<IPaging> & { storeId: number }>({
      query: ({ storeId, ...params }) => ({
        url: endpoints.getServiceEndpoints(storeId).services,
        method: "GET",
        params: {
          status: SERVICE_STATUS.ACTIVE,
          pageSize: 6,
          pageNumber: params?.pageNumber,
        },
      }),
      providesTags: [{ type: "Service", id: "LIST" }],
    }),
  }),
});

export const { useServicesQuery } = serviceApi;
