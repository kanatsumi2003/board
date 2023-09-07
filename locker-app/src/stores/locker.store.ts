import { ILockerInfoItem } from "@/interfaces/locker";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface LockerState {
  locker?: ILockerInfoItem;
}
const initialState: LockerState = {};

const lockerSlice = createSlice({
  name: "locker",
  initialState,
  reducers: {
    setLockerState(state, action: PayloadAction<Partial<LockerState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setLockerState } = lockerSlice.actions;

export default lockerSlice.reducer;
