import store, { AppState } from "@/stores";
import {
  clearInput,
  setGlobalState,
  updateInputs,
} from "@/stores/global.store";
import { useSelector } from "react-redux";

interface KeyboardConfig {
  inputName?: string;
  maxLength?: number;
  onlyNumber?: boolean;
  uppercase?: boolean;
}

function useKeyboard() {
  const { inputs, keyboard } = useSelector((state: AppState) => state.global);

  const isOpen = !!keyboard;

  const open = (config?: KeyboardConfig) =>
    store.dispatch(
      setGlobalState({
        keyboard: config,
      })
    );

  const close = () => {
    store.dispatch(
      setGlobalState({
        keyboard: undefined,
      })
    );
  };

  const update = (inputName: string, content: string) => {
    store.dispatch(
      updateInputs({
        [inputName]: content,
      })
    );
  };
  const clear = (inputNames?: string[]) => {
    if (inputNames) {
      inputNames.forEach((inputName) =>
        store.dispatch(
          updateInputs({
            [inputName]: "",
          })
        )
      );
    } else {
      store.dispatch(
        setGlobalState({
          inputs: undefined,
        })
      );
    }
  };
  return { inputs, keyboard, isOpen, open, close, clear, update };
}

export default useKeyboard;
