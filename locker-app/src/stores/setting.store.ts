import { ISettingItem } from "@/interfaces/setting";
import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface SettingState extends Partial<ISettingItem> {}

const initialState: SettingState = {};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSettingState(state, action: PayloadAction<Partial<SettingState>>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSettingState } = settingSlice.actions;

export default settingSlice.reducer;
