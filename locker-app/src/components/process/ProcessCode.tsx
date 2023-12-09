import useModal from "@/hooks/useModal";
import {
  useLazyOrderPinCodeQuery,
  useProcessOrderMutation,
} from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OtpForm from "../core/OtpForm";

interface Props {
  onNext: () => void;
}

function ProcessCode({ onNext }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const navigate = useNavigate();
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
    processOrder,
    {
      data: dataProcessOrder,
      isSuccess: isSuccessProcessOrder,
      isError: isErrorProcessOrder,
      error: errorProcessOrder,
    },
  ] = useProcessOrderMutation();

  const modal = useModal();

  const handleProcessOrder = (otp: string) => {
    if (otp.length === 6) {
      trigger({
        pinCode: otp,
        lockerId: Number(locker?.id),
      });
    }
  };

  useEffect(() => {
    if (isSuccessOrder && dataOrder) {
      processOrder({ id: dataOrder.id });
      store.dispatch(
        setOrderState({
          order: dataOrder,
        })
      );
      return;
    }
    if (isErrorOrder && errorOrder) {
      modal.error({
        message: errorOrder?.message?.message,
      });
    }
  }, [isSuccessOrder, isErrorOrder]);

  useEffect(() => {
    if (isSuccessProcessOrder && dataProcessOrder) {
      onNext();
      return;
    }
    if (isErrorProcessOrder) {
      modal.error({ message: errorProcessOrder?.message?.message });
    }
  }, [isSuccessProcessOrder, isErrorProcessOrder]);

  return (
    <>
      <div className="mt-8 flex w-full items-center flex-col gap-24 h-full">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
        ></div>
        <div className="font-bold text-white">
          Vui lòng nhập mã PIN đơn hàng
        </div>
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleProcessOrder} />
        </div>
      </div>
    </>
  );
}

export default ProcessCode;
