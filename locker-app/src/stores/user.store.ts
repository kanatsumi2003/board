import { IAccountItem } from "@/interfaces/account";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
  account?: IAccountItem;
}

const initialState: UserState = {};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserState(state, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload);
    },
    clearUser(state, action: PayloadAction<void>) {
      return initialState;
    },
  },
});

export const { setUserState, clearUser } = userSlice.actions;

export default userSlice.reducer;
