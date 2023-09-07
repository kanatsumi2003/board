import useModal from "@/hooks/useModal";
import {
  useLazyOrderPinCodeQuery,
  useReserveMutation,
} from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import BackButton from "../core/BackButton";
import OtpForm from "../core/OtpForm";
import { setGlobalState } from "@/stores/global.store";
import { useSelector } from "react-redux";

function ReserveCode({ onNext }: { onNext: () => void }) {
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
    store.dispatch(
      setGlobalState({
        keyboard: {
          maxLength: 6,
          onlyNumber: true,
          inputName: "otp",
        },
      })
    );
  }, []);

  useEffect(() => {
    if (isSuccessOrder && dataOrder) {
      reserveOrder({ id: dataOrder.id });
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
    }
    if (isErrorReserveOrder && errorReserveOrder) {
      modal.error({ message: errorReserveOrder?.message?.message });
    }
  }, [isSuccessReserveOrder, isErrorReserveOrder]);

  return (
    <>
      <div className="mt-8 flex w-full items-center flex-col gap-24 h-full">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
        ></div>
        <div className="text-3xl font-bold text-white">
          Vui lòng nhập mã đặt trước{" "}
        </div>
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleReserveOrder} />
        </div>
      </div>
      <BackButton />
    </>
  );
}

export default ReserveCode;
