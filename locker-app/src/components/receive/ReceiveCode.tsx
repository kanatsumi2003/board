import useModal from "@/hooks/useModal";
import { useLazyOrderPinCodeQuery } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import OtpForm from "../core/OtpForm";
import { ORDER_STATUS, ORDER_TYPE } from "@/interfaces/order";

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
      if (
        (data.status === ORDER_STATUS.WAITING &&
          data.type === ORDER_TYPE.STORAGE) ||
        (data.status === ORDER_STATUS.RETURNED &&
          data.type === ORDER_TYPE.LAUNDRY)
      ) {
        store.dispatch(
          setOrderState({
            order: data,
          })
        );
        onNext();
        return;
      } else {
        {
          modal.error({ message: "Đơn hàng không tồn tại." });
        }
      }
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Nhận hàng">Nhập mã đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <div className="flex w-full items-center flex-col gap-8">
          <OtpForm onSubmit={handleGetOrderDetail} />
        </div>
      </div>
    </>
  );
}

export default ReceiveCode;
