import type {
  ICheckOutOrderRequest,
  ICreateOrderRequest,
  IOrderDetailItem,
  IUpdateOrderRequest,
} from "@/interfaces/order";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IBillItem } from "@/interfaces/bill";
import { lockerApi } from "./lockerService";

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery(),
  refetchOnMountOrArgChange: true,
  tagTypes: ["Order", "Box"],
  endpoints: (build) => ({
    order: build.query<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderById,
        method: "GET",
      }),
    }),

    orderPinCode: build.query<
      IOrderDetailItem,
      { pinCode: string; lockerId: number }
    >({
      query: ({ pinCode, lockerId }) => ({
        url: endpoints.getOrderEndpoints(undefined, pinCode).orderByPinCode,

        method: "GET",
        headers: { lockerId: lockerId },
      }),
    }),

    createOrder: build.mutation<IOrderDetailItem, ICreateOrderRequest>({
      query: (data) => ({
        url: endpoints.getOrderEndpoints().orders,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    updateOrder: build.mutation<
      IOrderDetailItem,
      { id: number } & IUpdateOrderRequest
    >({
      query: ({ id, ...data }) => ({
        url: endpoints.getOrderEndpoints(id).orderById,
        method: "PUT",
        data,
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    confirmOrder: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderConfirm,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    checkOutOrder: build.mutation<
      IBillItem,
      { id: number } & ICheckOutOrderRequest
    >({
      query: ({ id, ...data }) => ({
        url: endpoints.getOrderEndpoints(id).orderCheckout,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    processOrder: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderProcess,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    returnOrder: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderReturn,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    bill: build.query<IBillItem, { orderId: number }>({
      query: ({ orderId }) => ({
        url: endpoints.getOrderEndpoints(orderId).orderBill,
        method: "GET",
      }),
      providesTags: [{ type: "Order" }],
    }),

    reserve: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderReservation,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useLazyOrderPinCodeQuery,
  useOrderQuery,
  useBillQuery,
  useConfirmOrderMutation,
  useCheckOutOrderMutation,
  useProcessOrderMutation,
  useReturnOrderMutation,
  useReserveMutation,
} = orderApi;
