import useKeyboard from "@/hooks/useKeyboard";
import useModal from "@/hooks/useModal";
import { useLazyOrderPinCodeQuery } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import OtpForm from "../core/OtpForm";
import Title from "../Title";

interface Props {
  onNext: () => void;
}

function ReceiveCode({ onNext }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [trigger, { data, isSuccess, isError, error }] =
    useLazyOrderPinCodeQuery();
  const modal = useModal();
  const { open } = useKeyboard();

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
    open({
      maxLength: 6,
      onlyNumber: false,
      uppercase: true,
      inputName: "otp",
    });
  }, []);

  return (
    <>
      <Title subtitle="Nhận hàng">Nhập mã đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleGetOrderDetail} />
        </div>
      </div>
      <BackButton />
    </>
  );
}

export default ReceiveCode;
