import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";

interface IMessage {
  message: string;
  onClose?: () => void;
}

function useModal() {
  const success = (message: IMessage) =>
    store.dispatch(
      setGlobalState({
        success: message.message,
        onModalClose: message.onClose,
      })
    );
  const error = (message: IMessage) =>
    store.dispatch(
      setGlobalState({
        error: message.message,
        onModalClose: message.onClose,
      })
    );
  return { success, error };
}

export default useModal;
