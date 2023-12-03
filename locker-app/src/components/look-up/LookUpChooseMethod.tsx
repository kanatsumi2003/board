import MomoLogo from "@/assets/momo_logo.png";
import VNPayLogo from "@/assets/vnpay_logo.jpg";
import { VN_PAY_MINIMUM_PAYMENT_ACCEPTANCE } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { ORDER_PAYMENT_METHOD } from "@/interfaces/order";
import { useDepositMutation } from "@/services/walletService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { formatThousandNumber } from "@/utils/formatter";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import Button from "../core/Button";
import { Card } from "../core/Card";

interface Props {
  onNext: (amount?: number) => void;
  phoneNumber?: string;
}

export default function LookUpChooseMethod({ onNext, phoneNumber }: Props) {
  const [method, setMethod] = useState<ORDER_PAYMENT_METHOD>();
  const [amount, setAmount] = useState<number>();
  const [amountError, setAmountError] = useState<string>();
  const { paymentSettings } = useSelector((state: AppState) => state.setting);
  const { inputs } = useKeyboard();
  const { open } = useKeyboard();
  const [deposit, { isSuccess, data }] = useDepositMutation();

  const showKeyboard = () => {
    open({
      maxLength: 100,
      inputName: "amount",
      onlyNumber: true,
    });
  };

  useEffect(() => {
    showKeyboard();
  }, []);

  useEffect(() => {
    if (inputs) {
      validateAmount(Number(inputs["amount"]));
      setAmount(inputs["amount"] ? Number(inputs["amount"]) : undefined);
    }
  }, [inputs]);

  useEffect(() => {
    if (isSuccess && data) {
      store.dispatch(
        setOrderState({
          payment: data,
        })
      );
      onNext(amount);
    }
  }, [isSuccess, data]);

  const handleDeposit = () => {
    if (method && amount && phoneNumber) {
      deposit({
        method: method,
        amount: amount,
        phoneNumber: phoneNumber,
      });
    }
  };

  const validateAmount = (amount: number) => {
    if (!amount || amount >= (paymentSettings?.minDeposit ?? 0)) {
      setAmountError(undefined);

      return;
    }
    setAmountError(
      `Vui lòng nhập số tiền lớn hơn hoặc bằng ${formatThousandNumber(
        paymentSettings?.minDeposit
      )}.`
    );
  };

  return (
    <>
      <Title subtitle="Nạp tiền">Vui lòng chọn số tiền cần nạp</Title>
      <div className="font-semibold flex flex-col gap-4 mt-52 w-full items-center px-12">
        <div className="mt-8  w-[600px]">
          <input
            type="text"
            autoFocus
            autoComplete="off"
            placeholder="Số tiền cần nạp"
            className={`focus:outline-locker-blue text-4xl rounded-lg border border-black w-full p-4 text-center ${
              amountError ? "border-locker-red" : ""
            }`}
            name="amount"
            required
            onClick={() => {
              showKeyboard();
            }}
            onFocus={() => {
              showKeyboard();
            }}
            value={formatThousandNumber(amount)}
          />
          <div className="col-span-2 text-locker-red mt-4">
            {amountError ?? ""}
          </div>
        </div>

        <Card className="flex flex-col w-full justify-center">
          <div className="mb-4 text-center">
            Vui lòng chọn phương thức thanh toán
          </div>
          <ul className="font-medium flex flex-col gap-8 w-full mt-8">
            {amount && amount >= VN_PAY_MINIMUM_PAYMENT_ACCEPTANCE && (
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
            )}
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
        <Button
          onClick={handleDeposit}
          type={amount && amount > 10_000 && method ? "primary" : "disabled"}
          small
          className="mt-8"
        >
          Xác nhận nạp tiền
        </Button>
      </div>
    </>
  );
}
