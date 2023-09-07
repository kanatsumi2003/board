import { IBillItem } from "@/interfaces/bill";
import { ICreateOrderRequest, IOrderDetailItem } from "@/interfaces/order";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface OrderState {
  orderRequest?: Partial<ICreateOrderRequest>;
  order?: IOrderDetailItem;
  bill?: IBillItem;
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
    setBill(state, action: PayloadAction<IBillItem>) {
      return {
        ...state,
        bill: action.payload,
      };
    },
    clearOrder(state, action: PayloadAction<void>) {
      return initialState;
    },
  },
});

export const { setOrderState, setOrderRequest, setBill, clearOrder } =
  orderSlice.actions;

export default orderSlice.reducer;
