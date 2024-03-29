import useModal from "@/hooks/useModal";
import {
  useLazyOrderPinCodeQuery,
  useReserveMutation,
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

function ReserveCode({ onNext }: Props) {
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
    reserveOrder,
    {
      data: dataReserveOrder,
      isSuccess: isSuccessReserveOrder,
      isError: isErrorReserveOrder,
      error: errorReserveOrder,
    },
  ] = useReserveMutation();

  const modal = useModal();

  const handleReserveOrder = (otp: string) => {
    if (otp.length === 6) {
      trigger({
        pinCode: otp,
        lockerId: Number(locker?.id),
      });
    }
  };

  useEffect(() => {
    if (isSuccessOrder && dataOrder) {
      reserveOrder({ id: dataOrder.id });
      return;
    }
    if (isErrorOrder && errorOrder) {
      modal.error({ message: errorOrder?.message?.message });
    }
  }, [isSuccessOrder, isErrorOrder]);

  useEffect(() => {
    if (isSuccessReserveOrder && dataReserveOrder) {
      store.dispatch(
        setOrderState({
          order: dataReserveOrder,
        })
      );
      onNext();
      return;
    }
    if (isErrorReserveOrder && errorReserveOrder) {
      modal.error({ message: errorReserveOrder?.message?.message });
    }
  }, [isSuccessReserveOrder, isErrorReserveOrder]);

  return (
    <>
      <Title subtitle="Đã đặt chỗ">Vui lòng nhập mã PIN đặt trước</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleReserveOrder} />
        </div>
      </div>
    </>
  );
}

export default ReserveCode;
