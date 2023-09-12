import useModal from "@/hooks/useModal";
import { useLazyOrderPinCodeQuery } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import BackButton from "../core/BackButton";
import OtpForm from "../core/OtpForm";
import { setGlobalState } from "@/stores/global.store";
import { useSelector } from "react-redux";

interface Props {
  onNext: () => void;
}

function ReceiveCode({ onNext }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [trigger, { data, isSuccess, isError, error }] =
    useLazyOrderPinCodeQuery();
  const modal = useModal();

  const handleGetOrderDetail = (otp: string) => {
    if (otp.length === 6) {
      trigger({
        pinCode: otp,
        lockerId: Number(locker?.id),
      });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      store.dispatch(
        setOrderState({
          order: data,
        })
      );
      onNext();
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

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

  return (
    <>
      <div className="mt-8 flex w-full items-center flex-col gap-24 h-full">
        <div className="absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10"></div>
        <div className="text-3xl font-bold text-white">Nhập mã đơn hàng </div>
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleGetOrderDetail} />
        </div>
      </div>
      <BackButton />
    </>
  );
}

export default ReceiveCode;
