import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface KeyboardConfig {
  inputName?: string;
  maxLength?: number;
  onlyNumber?: boolean;
  uppercase?: boolean;
  disablePositioning?: boolean;
}

export interface State {
  loading: boolean;
  keyboard?: KeyboardConfig;
  inputs?: { [key: string]: string };
  error?: string;
  success?: string;
  onModalClose?: () => void;
}

const initialState: State = {
  loading: false,
};

const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setGlobalState(state, action: PayloadAction<Partial<State>>) {
      Object.assign(state, action.payload);
    },

    updateInputs(state, action: PayloadAction<{ [key: string]: string }>) {
      const currentInp = state.inputs ?? {};
      state.inputs = { ...currentInp, ...action.payload };
      return state;
    },
    clearInput(state, action: PayloadAction<string>) {
      delete state.inputs?.[action.payload];
      return state;
    },
    clearGlobal(state, action: PayloadAction<void>) {
      return initialState;
    },
  },
});

export const { setGlobalState, updateInputs, clearGlobal, clearInput } =
  globalSlice.actions;

export default globalSlice.reducer;
