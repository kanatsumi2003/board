import type { PayloadAction } from "@reduxjs/toolkit";

import { createSlice } from "@reduxjs/toolkit";

export interface State {
  loading: boolean;
  keyboard?: {
    maxLength?: number;
    inputName?: string;
    onlyNumber?: boolean;
  };
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

export const { setGlobalState, updateInputs, clearGlobal } =
  globalSlice.actions;

export default globalSlice.reducer;
