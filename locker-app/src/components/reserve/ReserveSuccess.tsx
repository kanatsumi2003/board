import useModal from "@/hooks/useModal";
import { useConfirmOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import Title from "../Title";
import BoxNumber from "../core/BoxNumber";

interface Props {
  onNext: () => void;
}

function ReserveSuccess({ onNext }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const [confirmOrder, { isSuccess, isError, error }] =
    useConfirmOrderMutation();
  const modal = useModal();
  const handleConfirmOrder = () => {
    if (order) {
      confirmOrder({ id: order?.id });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      onNext();
    }
    if (isError && error) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Đặt trước">Vui lòng để đồ vào ô tủ số</Title>
      <div className="flex w-full items-center flex-col justify-between h-full mt-52">
        <div className="text-center">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất.
        </div>
        <BoxNumber>{order?.sendBox?.number}</BoxNumber>
        <Button type="primary" small onClick={handleConfirmOrder}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}

export default ReserveSuccess;
