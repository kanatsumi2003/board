import useModal from "@/hooks/useModal";
import { useLazyCheckBoxesQuery } from "@/services/boardService";
import { useConfirmOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function SendSuccess({ onNext }: Props) {
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
    <div className="mt-8 flex w-full items-center flex-col justify-between h-full px-12">
      <div className="text-center">
        <div className="font-bold text-black text-4xl">
          Vui lòng để đồ vào ô tủ số
        </div>
        <div className="mt-8">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất quá
          trình gửi đồ
        </div>
      </div>
      <div className="text-[200px] font-bold text-locker-blue p-4 rounded-full">
        {order?.sendBox?.number}
      </div>
      <Button type="primary" small onClick={handleConfirmOrder}>
        Xác nhận
      </Button>
    </div>
  );
}

export default SendSuccess;
