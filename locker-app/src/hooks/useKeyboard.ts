import store, { AppState } from "@/stores";
import {
  KeyboardConfig,
  clearInput,
  setGlobalState,
  updateInputs,
} from "@/stores/global.store";
import { useSelector } from "react-redux";

function useKeyboard() {
  const { inputs, keyboard } = useSelector((state: AppState) => state.global);

  const isOpen = !!keyboard;

  // OPEN THE KEYBOARD
  const open = (config?: KeyboardConfig) =>
    store.dispatch(
      setGlobalState({
        keyboard: config,
      })
    );

  // CLOSE THE KEYBOARD
  const close = () => {
    store.dispatch(
      setGlobalState({
        keyboard: undefined,
      })
    );
  };

  // UPDATE THE KEYBOARD
  const update = (inputName: string, content: string) => {
    store.dispatch(
      updateInputs({
        [inputName]: content,
      })
    );
  };

  // CLEAR THE KEYBOARD (EMPTY PARAM FOR CLEAR ALL)
  const clear = (inputNames?: string[]) => {
    if (inputNames) {
      inputNames.forEach((inputName) => store.dispatch(clearInput(inputName)));
    } else {
      store.dispatch(clearInput());
    }
  };
  return { inputs, keyboard, isOpen, open, close, clear, update };
}

export default useKeyboard;
