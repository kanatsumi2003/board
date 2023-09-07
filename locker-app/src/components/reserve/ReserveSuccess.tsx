import useModal from "@/hooks/useModal";
import { useConfirmOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";

function ReserveSuccess({ onNext }: { onNext: () => void }) {
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
    <div className="mt-8 flex w-full items-center flex-col justify-between h-full">
      <div
        className={`absolute top-0 left-0 right-0 bg-locker-blue h-48 rounded-b-[120px] -z-10`}
      ></div>

      <div className="text-center text-white">
        <div className="text-3xl font-bold">Vui lòng để đồ vào ô tủ số</div>
        <div className="mt-4">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất.
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

export default ReserveSuccess;
