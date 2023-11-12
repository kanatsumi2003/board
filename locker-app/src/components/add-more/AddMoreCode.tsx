import useModal from "@/hooks/useModal";
import {
  useAddMoreMutation,
  useLazyOrderPinCodeQuery,
} from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import OtpForm from "../core/OtpForm";

interface Props {
  onNext: () => void;
}

export default function AddMoreCode({ onNext }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [
    trigger,
    {
      data: dataOrder,
      isSuccess: isSuccessOrder,
      isError: isErrorOrder,
      error: errorOrder,
    },
  ] = useLazyOrderPinCodeQuery();
  const [
    addMore,
    {
      data: dataAddMore,
      isSuccess: isSuccessAddMore,
      isError: isErrorAddMore,
      error: errorAddMore,
    },
  ] = useAddMoreMutation();

  const modal = useModal();

  const handleAddMore = (otp: string) => {
    if (otp.length === 6) {
      trigger({
        pinCode: otp,
        lockerId: Number(locker?.id),
      });
    }
  };

  useEffect(() => {
    if (isSuccessOrder && dataOrder) {
      addMore({ id: dataOrder.id });
      return;
    }
    if (isErrorOrder && errorOrder) {
      modal.error({ message: errorOrder?.message?.message });
    }
  }, [isSuccessOrder, isErrorOrder]);

  useEffect(() => {
    if (isSuccessAddMore && dataAddMore) {
      store.dispatch(
        setOrderState({
          order: dataAddMore,
        })
      );
      onNext();
      return;
    }
    if (isErrorAddMore && errorAddMore) {
      modal.error({ message: errorAddMore?.message?.message });
    }
  }, [isSuccessAddMore, isErrorAddMore]);

  return (
    <>
      <Title subtitle="Gửi thêm đồ">Vui lòng nhập mã PIN đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleAddMore} />
        </div>
      </div>
    </>
  );
}
