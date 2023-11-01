import OrderContainer from "@/containers/OrderContainer";
import useModal from "@/hooks/useModal";
import { useCollectOrderMutation } from "@/services/orderService";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Title from "../Title";
import BackButton from "../core/BackButton";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ProcessOrderDetail({ onNext }: Props) {
  const { id } = useParams();
  const [collectOrder, { data, isSuccess, isError, error }] =
    useCollectOrderMutation();

  const modal = useModal();

  const handleProcessOrder = () => {
    collectOrder({ id: Number(id) });
  };

  useEffect(() => {
    if (isSuccess && data) {
      onNext();
      return;
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Xử lý đơn hàng">Thông tin chi tiết đơn hàng</Title>
      <OrderContainer id={Number(id)} />
      <Button type="primary" small onClick={handleProcessOrder}>
        Xác nhận đơn hàng
      </Button>
      <BackButton />
    </>
  );
}

export default ProcessOrderDetail;
