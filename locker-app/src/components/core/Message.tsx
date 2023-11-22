import useCountDown from "@/hooks/useCountdown";
import store, { AppState } from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiCheckCircle, BiErrorCircle } from "react-icons/bi";
import { useSelector } from "react-redux";

interface Props {
  children: string;
  type: "success" | "error" | "confirm";
  onClose: () => void;
  onOk?: () => void;
}

function MessageModal({ children, type, onClose, onOk }: Props) {
  const { countDown } = useCountDown(5);

  useEffect(() => {
    if (!countDown && type !== "confirm") {
      onClose();
    }
  }, [countDown]);

  return (
    <div className="transition-all fixed bottom-0 top-0 left-0 right-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto max-h-full bg-gray-400 bg-opacity-60">
      <div className="relative bg-white rounded-lg shadow p-4 px-20">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ml-auto inline-flex justify-center items-center"
          onClick={onClose}
        >
          <AiOutlineClose className="text-3xl" />
          <span className="sr-only">Close modal</span>
        </button>
        {(() => {
          switch (type) {
            case "success":
              return (
                <>
                  <div className="p-6 text-center flex flex-col gap-4">
                    <div className="w-full flex justify-center text-8xl text-locker-green">
                      <BiCheckCircle />
                    </div>
                    <h3 className="my-5 font-normal text-gray-600 ">
                      {children}
                    </h3>
                    <button
                      type="button"
                      className="bg-white hover:bg-locker-green hover:text-white focus:outline-none rounded-lg border border-gray-300 font-medium px-8 py-4 transition-all"
                      onClick={onClose}
                    >
                      {`Đã hiểu (Tự đóng sau ${countDown}s)`}
                    </button>
                  </div>
                </>
              );
            case "error":
              return (
                <>
                  <div className="p-6 text-center flex flex-col gap-4">
                    <div className="w-full flex justify-center text-8xl text-locker-red">
                      <BiErrorCircle />
                    </div>
                    <h3 className="my-5 font-normal text-gray-600">
                      {children}
                    </h3>
                    <button
                      type="button"
                      className="bg-whitehover:bg-locker-red hover:text-white focus:outline-none rounded-lg border border-gray-300 font-medium px-8 py-4 transition-all"
                      onClick={onClose}
                    >
                      {`Đã hiểu (Tự đóng sau ${countDown}s)`}
                    </button>
                  </div>
                </>
              );

            case "confirm": {
              return (
                <>
                  <div className="p-6 text-center flex flex-col gap-4">
                    <div className="w-full flex justify-center text-8xl text-locker-yellow">
                      <BiErrorCircle />
                    </div>
                    <h3 className="my-5 font-normal text-gray-600">
                      {children}
                    </h3>
                    <div className="flex gap-8 justify-center">
                      <button
                        type="button"
                        className="bg-whitehover:bg-locker-red focus:outline-none hover:text-white hover:bg-locker-yellow text-3xl rounded-lg border border-locker-yellow font-medium px-8 py-4 transition-all"
                        onClick={onClose}
                      >
                        Thử lại
                      </button>
                      <button
                        type="button"
                        className="bg-whitehover:bg-locker-red text-white focus:outline-none rounded-lg border border-gray-300 bg-locker-yellow font-medium px-8 py-4 transition-all"
                        onClick={onOk}
                      >
                        Đồng ý
                      </button>
                    </div>
                  </div>
                </>
              );
            }
          }
        })()}
      </div>
    </div>
  );
}

function Message() {
  const { modal } = useSelector((state: AppState) => state.global);
  const handleClose = () => {
    store.dispatch(
      setGlobalState({
        modal: undefined,
      })
    );
  };

  return (
    modal && (
      <MessageModal
        type={modal.type}
        onClose={() => {
          handleClose();
          modal?.onModalClose && modal?.onModalClose();
        }}
        onOk={() => {
          handleClose();
          modal?.onModalOk && modal?.onModalOk();
        }}
      >
        {modal.message ?? "Đã có lỗi xảy ra, vui lòng thử lại sau!"}
      </MessageModal>
    )
  );
}

export default Message;
