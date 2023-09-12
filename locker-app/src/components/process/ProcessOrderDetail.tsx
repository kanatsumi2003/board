import OrderContainer from "@/containers/OrderContainer";
import useModal from "@/hooks/useModal";
import { useProcessOrderMutation } from "@/services/orderService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import BackButton from "../core/BackButton";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ProcessOrderDetail({ onNext }: Props) {
  const { id } = useParams();
  const [processOrder, { data, isSuccess, isError, error }] =
    useProcessOrderMutation();

  const modal = useModal();

  const handleProcessOrder = () => {
    processOrder({ id: Number(id) });
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
      <Button type="primary" small onClick={handleProcessOrder}>
        Xác nhận đơn hàng
      </Button>
      <BackButton />
    </>
  );
}

export default ProcessOrderDetail;
