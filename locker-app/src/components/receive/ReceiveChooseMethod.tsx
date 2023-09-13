import MomoLogo from "@/assets/momo_logo.png";
import VNPayLogo from "@/assets/vnpay_logo.jpg";
import Button from "@/components/core/Button";
import useModal from "@/hooks/useModal";
import { ORDER_PAYMENT_METHOD } from "@/interfaces/order";
import { useCheckOutOrderMutation } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setBill } from "@/stores/order.store";
import { formatCurrency } from "@/utils/formatter";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function ReceiveChooseMethod({ onNext, onPrev }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const [checkOut, { isSuccess, data, isError, error }] =
    useCheckOutOrderMutation();
  const [method, setMethod] = useState<ORDER_PAYMENT_METHOD>();
  const modal = useModal();

  const handleCheckOut = () => {
    if (order && method) {
      checkOut({ id: order?.id, method: method });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      store.dispatch(setBill(data));
      onNext();
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  if (!order) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-60 rounded-b-[80px] -z-10`}
        ></div>
        <div className="font-bold mt-4 text-white">
          Xác nhận thông tin đơn hàng
        </div>
        <div className="font-light mt-2 text-white">Số tiền thanh toán</div>
        <div className="text-5xl font-bold text-white">
          {formatCurrency(order.price + (order.extraFee ?? 0))}
        </div>
      </div>
      <div className="bg-white shadow-2xl px-14 py-8 rounded-3xl gap-4">
        <div className="text-lg mb-4 text-center">
          Vui lòng chọn phương thức thanh toán
        </div>
        <ul className="font-medium flex flex-col gap-2 w-[400px]">
          <li
            className="rounded-lg border-2 border-locker-blue"
            onClick={() => setMethod(ORDER_PAYMENT_METHOD.VN_PAY)}
          >
            <div className="flex items-center pl-3">
              <input
                id={ORDER_PAYMENT_METHOD.VN_PAY}
                type="radio"
                value=""
                checked={method === ORDER_PAYMENT_METHOD.VN_PAY}
                name="list-radio"
                className="w-4 h-4 checked:bg-locker-blue"
              />
              <label
                htmlFor={ORDER_PAYMENT_METHOD.VN_PAY}
                className="py-3 font-medium text-gray-900 flex ml-4 items-center gap-2"
              >
                <img src={VNPayLogo} alt="VNPayLogo" className="w-12 h-12" />
                <div>Ví điện tử VN Pay</div>
              </label>
            </div>
          </li>
          <li
            className="w-full rounded-lg border-2 border-locker-blue"
            onClick={() => setMethod(ORDER_PAYMENT_METHOD.MOMO)}
          >
            <div className="flex items-center pl-3">
              <input
                id={ORDER_PAYMENT_METHOD.MOMO}
                type="radio"
                value=""
                name="list-radio"
                checked={method === ORDER_PAYMENT_METHOD.MOMO}
                className="w-4 h-4 checked:bg-locker-blue"
              />
              <label
                htmlFor={ORDER_PAYMENT_METHOD.MOMO}
                className="w-full py-3 font-medium text-gray-900 flex ml-4 items-center gap-2"
              >
                <img src={MomoLogo} alt="VNPayLogo" className="w-12 h-12" />
                <div>Ví điện tử Momo</div>
              </label>
            </div>
          </li>
        </ul>
      </div>
      <Button type="primary" small onClick={handleCheckOut}>
        Xác nhận thanh toán
      </Button>
      <BackButton onClick={onPrev} />
    </>
  );
}

export default ReceiveChooseMethod;
