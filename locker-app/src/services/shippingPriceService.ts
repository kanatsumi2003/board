import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IShippingPriceItem } from "@/interfaces/shipping-price";

export const shippingPriceApi = createApi({
  reducerPath: "shippingPriceApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["ShippingPrice"],
  endpoints: (build) => ({
    shippingPrice: build.query<IShippingPriceItem[], void>({
      query: () => ({
        url: endpoints.getShippingPriceEndPoints().shippingPrices,
        method: "GET",
      }),

      providesTags: [{ type: "ShippingPrice" }],
    }),
  }),
});

export const { useShippingPriceQuery } = shippingPriceApi;
