import { PATH } from "@/constants/common";
import useModal from "@/hooks/useModal";
import {
  useLazyOrderPinCodeQuery,
  useReturnOrderMutation,
} from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BackButton from "../core/BackButton";
import OtpForm from "../core/OtpForm";

interface Props {
  onNext: () => void;
}

function ReturnCode({ onNext }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const navigate = useNavigate();
  const modal = useModal();
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
    returnOrder,
    {
      data: dataReturnOrder,
      isSuccess: isSuccessReturnOrder,
      isError: isErrorReturnOrder,
      error: errorReturnOrder,
    },
  ] = useReturnOrderMutation();

  const handleReturnOrder = (otp: string) => {
    if (otp.length === 6) {
      trigger({
        pinCode: otp,
        lockerId: Number(locker?.id),
      });
    }
  };

  useEffect(() => {
    if (isSuccessOrder && dataOrder) {
      returnOrder({ id: dataOrder.id });
    }
    if (isErrorOrder && errorOrder) {
      modal.error({ message: errorOrder?.message?.message });
    }
  }, [isSuccessOrder, isErrorOrder]);

  useEffect(() => {
    if (isSuccessReturnOrder && dataReturnOrder) {
      store.dispatch(
        setOrderState({
          order: dataReturnOrder,
        })
      );
      onNext();
    }
    if (isErrorReturnOrder && errorReturnOrder) {
      modal.error({ message: errorReturnOrder?.message?.message });
    }
  }, [isSuccessReturnOrder, isErrorReturnOrder]);

  return (
    <>
      <div className="mt-8 flex w-full items-center flex-col gap-24 h-full">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
        ></div>
        <div className="font-bold text-white">Vui lòng nhập mã đơn hàng </div>
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleReturnOrder} />
        </div>
      </div>
      <BackButton onClick={() => navigate(PATH.DASHBOARD)} />
    </>
  );
}

export default ReturnCode;
