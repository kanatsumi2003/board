import { ICreateOrderRequest, IOrderDetailItem } from "@/interfaces/order";
import { IPaymentItem } from "@/interfaces/payment";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface OrderState {
  orderRequest?: Partial<ICreateOrderRequest>;
  order?: IOrderDetailItem;
  lookUpPhoneNumber?: string;
  payment?: IPaymentItem;
}

const initialState: OrderState = {};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrderState(state, action: PayloadAction<Partial<OrderState>>) {
      Object.assign(state, action.payload);
    },
    setOrderRequest(
      state,
      action: PayloadAction<Partial<ICreateOrderRequest>>
    ) {
      return {
        ...state,
        orderRequest: {
          ...state.orderRequest,
          ...action.payload,
        },
      };
    },
    setPayment(state, action: PayloadAction<IPaymentItem>) {
      return {
        ...state,
        payment: action.payload,
      };
    },
    clearOrder(state, action: PayloadAction<void>) {
      return initialState;
    },
  },
});

export const { setOrderState, setOrderRequest, setPayment, clearOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
