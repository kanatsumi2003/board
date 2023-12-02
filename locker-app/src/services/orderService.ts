import type {
  ICheckOutOrderRequest,
  ICreateOrderRequest,
  IOrder,
  IOrderDetailItem,
  IOrdersParams,
  IUpdateOrderRequest,
} from "@/interfaces/order";

import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/configs/axiosBaseQuery";
import endpoints from "@/constants/endpoints";
import { IPaymentItem } from "@/interfaces/payment";

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

    orders: build.query<IOrder, IOrdersParams | void>({
      query: (params) => ({
        url: endpoints.getOrderEndpoints().orders,
        method: "GET",
        params,
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

    checkOutOrder: build.mutation<IPaymentItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderCheckout,
        method: "PUT",
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

    collectOrder: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).collectOrder,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Order" }, { type: "Box" }],
    }),

    processOvertimeOrder: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).processOvertimeOrder,
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

    payment: build.query<IPaymentItem, { paymentId: number }>({
      query: ({ paymentId }) => ({
        url: endpoints.getPaymentEndpoints(paymentId).paymentById,
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

    addMore: build.mutation<IOrderDetailItem, { id: number }>({
      query: ({ id }) => ({
        url: endpoints.getOrderEndpoints(id).orderAddMore,
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
  useOrdersQuery,
  usePaymentQuery,
  useConfirmOrderMutation,
  useCheckOutOrderMutation,
  useProcessOrderMutation,
  useProcessOvertimeOrderMutation,
  useReturnOrderMutation,
  useReserveMutation,
  useCollectOrderMutation,
  useAddMoreMutation,
} = orderApi;
