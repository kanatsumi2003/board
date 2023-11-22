import OrderContainer from "@/containers/OrderContainer";
import useModal from "@/hooks/useModal";
import { useReturnOrderMutation } from "@/services/orderService";
import store from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Title from "../Title";
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
      store.dispatch(setOrderState({ order: data }));
      onNext();
      return;
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Hoàn trả đơn hàng">Thông tin chi tiết đơn hàng</Title>
      <OrderContainer id={Number(id)} />
      <Button type="primary" small onClick={handleReturnOrder}>
        Xác nhận đơn hàng
      </Button>
    </>
  );
}

export default ReturnOrderDetail;
