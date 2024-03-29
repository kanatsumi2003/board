import useKeyboard from "@/hooks/useKeyboard";
import { useLazyCustomerByPhoneQuery } from "@/services/customerService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { IoWallet } from "react-icons/io5";
import { useSelector } from "react-redux";
import Title from "../Title";
import Button from "../core/Button";
import { Card } from "../core/Card";
import { Modal } from "../core/Modal";

interface Props {
  onNext: (phoneNumber?: string) => void;
}

export default function LookUpDetail({ onNext }: Props) {
  const { open, close, update } = useKeyboard();
  const { lookUpPhoneNumber } = useSelector((state: AppState) => state.order);
  const [phoneNumber, setPhoneNumber] = useState<string | undefined>(
    lookUpPhoneNumber
  );
  const [phoneNumberError, setPhoneNumberError] = useState<string>();
  const [openModal, setOpenModal] = useState(false);
  const { inputs } = useKeyboard();
  const [getCustomer, { data, isSuccess, isFetching }] =
    useLazyCustomerByPhoneQuery();

  const showKeyboard = () => {
    open({
      maxLength: 10,
      inputName: "phoneNumber",
      onlyNumber: true,
    });
  };

  useEffect(() => {
    showKeyboard();
    if (phoneNumber) {
      handleLookUp();
      update("phoneNumber", phoneNumber);
    }
  }, []);

  useEffect(() => {
    if (inputs) {
      validatePhone(inputs["phoneNumber"]);
      setPhoneNumber(inputs["phoneNumber"]);
    }
  }, [inputs]);

  const handleLookUp = () => {
    if (phoneNumber) {
      getCustomer({
        phone: phoneNumber,
      });
    }
  };

  const validatePhone = (value: string) => {
    if (!value || isValidPhone(value)) {
      setPhoneNumberError(undefined);

      return;
    }
    setPhoneNumberError("Số điện thoại không hợp lệ.");
  };

  useEffect(() => {
    setOpenModal(isSuccess && !isFetching);
    if (isSuccess && !isFetching) {
      store.dispatch(
        setOrderState({
          lookUpPhoneNumber: phoneNumber,
        })
      );
    }
  }, [isSuccess, isFetching]);

  useEffect(() => {
    if (openModal) {
      close();
    }
  }, [openModal]);

  return (
    <>
      <Title subtitle="Tra cứu">Vui lòng nhập số điện thoại</Title>
      <div className="font-semibold flex flex-col gap-4 mt-52">
        <div className="mt-8">
          <input
            type="text"
            autoFocus
            autoComplete="off"
            placeholder="Số điện thoại"
            className={`focus:outline-locker-blue text-4xl rounded-lg border border-black w-[600px] p-4 text-center ${
              phoneNumberError ? "border-locker-red" : ""
            }`}
            name="phoneNumber"
            required
            onClick={() => {
              showKeyboard();
            }}
            onFocus={() => {
              showKeyboard();
            }}
            value={phoneNumber}
          />
          <div className="col-span-2 text-locker-red mt-4">
            {phoneNumberError ?? ""}
          </div>
        </div>
        <Button
          onClick={handleLookUp}
          type="primary"
          icon={<FaAngleRight className="group-hover:translate-x-0.5" />}
          small
        >
          Tra cứu
        </Button>
      </div>

      {!phoneNumberError && phoneNumber && data && isSuccess && openModal && (
        <>
          <Modal
            className="py-12 px-8 flex flex-col gap-8 w-[740px]"
            onClose={() => setOpenModal(false)}
          >
            <div className="font-semibold col-span-2 mb-4 text-4xl">
              Thông tin khách hàng
            </div>
            <Card className="flex !bg-locker-blue !text-white items-center gap-8">
              <div className="flex items-center h-full">
                <IoWallet className="text-8xl p-4 bg-white text-locker-blue rounded-2xl" />
              </div>
              <div className="flex flex-col items-start">
                <div className="text-center">Số dư</div>
                <div className="text-center font-bold text-6xl">
                  {formatCurrency(data.wallet?.balance ?? 0)}
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-2 gap-y-6 justify-center p-8">
              <div>Họ và tên:</div>
              <div className="font-bold text-end">
                {data?.fullName ?? "Chưa cập nhật"}
              </div>
              <div>Số điện thoại:</div>
              <div className="font-bold text-end">{data?.phoneNumber}</div>
              <div>Mô tả:</div>
              <div className="font-bold text-end">
                {data?.description ?? "Chưa cập nhật"}
              </div>
              <div>Nạp lần cuối:</div>
              <div className="font-bold text-end">
                {data?.wallet?.lastDepositAt
                  ? formatDate(data?.wallet?.lastDepositAt)
                  : "Chưa cập nhật"}
              </div>
            </div>
            <Button onClick={() => onNext(phoneNumber)} type="primary" small>
              Nạp tiền vào tài khoản
            </Button>
          </Modal>
        </>
      )}
    </>
  );
}
