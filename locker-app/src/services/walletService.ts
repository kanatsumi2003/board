import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IWalletParam } from "@/interfaces/account";
import { IPaymentItem } from "@/interfaces/payment";

export const walletApi = createApi({
  reducerPath: "walletApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Wallet"],
  endpoints: (build) => ({
    deposit: build.mutation<IPaymentItem, IWalletParam>({
      query: ({ ...data }) => ({
        url: endpoints.getWalletEndpoints().deposit,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Wallet" }],
    }),
  }),
});

export const { useDepositMutation } = walletApi;
