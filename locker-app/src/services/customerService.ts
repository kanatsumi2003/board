import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import { ICustomerItem } from "@/interfaces/account";
import endpoints from "@/constants/endpoints";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  endpoints: (build) => ({
    customerByPhone: build.query<ICustomerItem, { phone: string }>({
      query: ({ phone }) => ({
        url: endpoints.getCustomerEndpoints().customerByPhone,
        method: "GET",
        params: {
          phone,
        },
      }),
    }),
  }),
});

export const { useLazyCustomerByPhoneQuery } = customerApi;
