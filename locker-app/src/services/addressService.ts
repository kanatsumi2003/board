import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IAddressItem, IAddressParams } from "@/interfaces/address";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Addresses"],
  endpoints: (build) => ({
    addresses: build.query<
      Array<IAddressItem>,
      Partial<IAddressParams> | void
    >({
      query: (params) => ({
        url: endpoints.getAddressEndpoints().addresses,
        method: "GET",
        params,
      }),
      providesTags: [{ type: "Addresses", id: "LIST" }],
    }),
  }),
});

export const { useAddressesQuery } = addressApi;
