import useModal from "@/hooks/useModal";
import { useLazyCheckBoxesQuery } from "@/services/boardService";
import { useConfirmOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";

function SendSuccess({ onNext }: { onNext: () => void }) {
  const modal = useModal();
  const { order } = useSelector((state: AppState) => state.order);
  const [confirmOrder, { isSuccess, data, isError, error }] =
    useConfirmOrderMutation();

  const [
    checkBoxes,
    {
      isSuccess: checkBoxIsSuccess,
      isError: checkBoxesIsError,
      isLoading: checkBoxesIsLoading,
      error: checkBoxesError,
      data: checkBoxesData,
      isUninitialized: checkBoxesIsUninitialized,
    },
  ] = useLazyCheckBoxesQuery();

  const handleConfirmOrder = () => {
    checkBoxes();
  };

  useEffect(() => {
    //TODO: RANDOM TRUE FALSE
    // if (checkBoxIsSuccess && order) {
    if (order && !checkBoxesIsUninitialized) {
      if (Math.random() < 0.5) {
        confirmOrder({ id: order?.id });
      } else {
        modal.error({
          message: "Vui lòng đóng chặt tủ để hoàn tất!",
        });
      }
    }
    // if (checkBoxesIsError) {
    //   store.dispatch(setError(checkBoxesError?.message));
    // }
  }, [checkBoxIsSuccess, checkBoxesIsError]);

  useEffect(() => {
    if (isSuccess) {
      onNext();
      modal.success({
        message: "Cảm ơn bạn đã sử dụng dịch vụ.",
      });
    }
    if (isError && error) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <div className="mt-8 flex w-full items-center flex-col justify-between h-full">
      <div className="text-center">
        <div className="text-3xl font-bold text-black">
          Vui lòng để đồ vào ô tủ số
        </div>
        <div className="mt-4">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất quá
          trình gửi đồ
        </div>
      </div>
      <div className="text-[160px] font-bold text-locker-blue p-4 rounded-full">
        {order?.sendBox?.number}
      </div>
      <Button type="primary" small onClick={handleConfirmOrder}>
        Xác nhận
      </Button>
    </div>
  );
}

export default SendSuccess;
