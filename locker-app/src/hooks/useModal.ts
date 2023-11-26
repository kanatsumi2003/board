import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";

interface IMessage {
  message: string;
  onClose?: () => void;
  onOk?: () => void;
}

function useModal() {
  const success = (message: IMessage) =>
    store.dispatch(
      setGlobalState({
        modal: {
          type: "success",
          message: message.message,
          onModalClose: message.onClose,
        },
      })
    );
  const error = (message: IMessage) =>
    store.dispatch(
      setGlobalState({
        modal: {
          type: "error",
          message: message.message,
          onModalClose: message.onClose,
        },
      })
    );
  const confirm = (message: IMessage) =>
    store.dispatch(
      setGlobalState({
        modal: {
          type: "confirm",
          message: message.message,
          onModalClose: message.onClose,
          onModalOk: message.onOk,
        },
      })
    );
  return { success, error, confirm };
}

export default useModal;
