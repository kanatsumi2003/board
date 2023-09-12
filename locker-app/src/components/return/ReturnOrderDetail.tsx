import OrderContainer from "@/containers/OrderContainer";
import useModal from "@/hooks/useModal";
import { useReturnOrderMutation } from "@/services/orderService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../core/BackButton";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ReturnOrderDetail({ onNext }: Props) {
  const { id } = useParams();
  const [returnOrder, { data, isSuccess, isError, error }] =
    useReturnOrderMutation();

  const modal = useModal();

  const handleReturnOrder = () => {
    returnOrder({ id: Number(id) });
  };

  useEffect(() => {
    if (isSuccess && data) {
      onNext();
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <div className="flex flex-col items-center gap-2 mt-6">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
        ></div>
        <div className="text-5xl font-bold text-white">Thông tin đơn hàng</div>
      </div>
      <OrderContainer id={Number(id)} />
      <Button type="primary" small onClick={handleReturnOrder}>
        Xác nhận đơn hàng
      </Button>
      <BackButton />
    </>
  );
}

export default ReturnOrderDetail;
