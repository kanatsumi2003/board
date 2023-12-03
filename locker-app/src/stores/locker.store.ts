import { ILockerInfoItem, ILockerItem } from "@/interfaces/locker";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface LockerState {
  lockerInfo?: ILockerInfoItem;
  locker?: ILockerItem;
}
const initialState: LockerState = {};

const lockerSlice = createSlice({
  name: "locker",
  initialState,
  reducers: {
    setLockerState(state, action: PayloadAction<Partial<LockerState>>) {
      Object.assign(state, action.payload);
    },
    clearLockerState(state, action: PayloadAction<Partial<LockerState>>) {
      return initialState;
    },
  },
});

export const { setLockerState, clearLockerState } = lockerSlice.actions;

export default lockerSlice.reducer;
