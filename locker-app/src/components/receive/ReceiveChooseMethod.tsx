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
import Title from "../Title";
import BackStepButton from "../core/BackStepButton";
import { Card } from "../core/Card";

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
      <Title subtitle="Nhận hàng">Xác nhận thông tin đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full px-12 justify-between">
        <div className="w-full">
          <div className="text-center w-full">
            <div className="font-light mt-2">Số tiền cần thanh toán</div>
            <div className="text-7xl font-bold mt-4">
              {formatCurrency(order.price + (order.extraFee ?? 0))}
            </div>
          </div>
          <Card className="flex flex-col w-full justify-center mt-12">
            <div className="mb-4 text-center">
              Vui lòng chọn phương thức thanh toán
            </div>
            <ul className="font-medium flex flex-col gap-8 w-full mt-8">
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
                    className="w-8 h-8 checked:bg-locker-blue"
                  />
                  <label
                    htmlFor={ORDER_PAYMENT_METHOD.VN_PAY}
                    className="py-3 font-medium text-gray-900 flex ml-4 items-center gap-6"
                  >
                    <img
                      src={VNPayLogo}
                      alt="VNPayLogo"
                      className="w-28 h-28"
                    />
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
                    className="w-8 h-8 checked:bg-locker-blue"
                  />
                  <label
                    htmlFor={ORDER_PAYMENT_METHOD.MOMO}
                    className="w-full py-3 font-medium text-gray-900 flex ml-4 items-center gap-6"
                  >
                    <img src={MomoLogo} alt="VNPayLogo" className="w-28 h-28" />
                    <div>Ví điện tử Momo</div>
                  </label>
                </div>
              </li>
            </ul>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            type={method ? "primary" : "disabled"}
            small
            onClick={handleCheckOut}
          >
            Xác nhận thanh toán
          </Button>
          <BackStepButton onClick={onPrev} />
        </div>
      </div>
    </>
  );
}

export default ReceiveChooseMethod;
