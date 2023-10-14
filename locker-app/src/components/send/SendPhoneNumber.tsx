import useKeyboard from "@/hooks/useKeyboard";
import { useLazyCustomerByPhoneQuery } from "@/services/customerService";
import store, { AppState } from "@/stores";
import { updateInputs } from "@/stores/global.store";
import { setOrderRequest } from "@/stores/order.store";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Input from "../core/Input";
import Switch from "../core/Switch";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendPhoneNumber({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [showReceiver, setShowReceiver] = useState(false);
  const [receiverName, setReceiverName] = useState<string>();
  const [senderName, setSenderName] = useState<string>();
  const [error, setError] = useState<CreateOrderFormError>();
  const { open } = useKeyboard();

  const [
    getSender,
    {
      data: senderData,
      isSuccess: senderIsSuccess,
      isFetching: senderIsFetching,
    },
  ] = useLazyCustomerByPhoneQuery();
  const [
    getReceiver,
    {
      data: receiverData,
      isSuccess: receiverIsSuccess,
      isFetching: receiverIsFetching,
    },
  ] = useLazyCustomerByPhoneQuery();

  const onSubmitCreateOrder = () => {
    if (!orderRequest?.senderPhone) {
      setError((prev) => ({
        ...prev,
        senderPhone: "Vui lòng nhập số điện thoại người gửi.",
      }));
      return;
    }
    if (!error?.receiverPhone && !error?.senderPhone) {
      onNext();
    }
  };

  useEffect(() => {
    setReceiverName(undefined);
  }, [showReceiver]);

  useEffect(() => {
    store.dispatch(
      updateInputs({
        senderPhone: orderRequest?.senderPhone ?? "",
        receiverPhone: orderRequest?.receiverPhone ?? "",
      })
    );
    showKeyboard("senderPhone");
  }, []);

  const validateSenderPhone = (value: string) => {
    if (!value || isValidPhone(value)) {
      if (value) {
        getSender({ phone: value });
      }

      setError((prev) => ({ ...prev, senderPhone: undefined }));
      return;
    }
    setSenderName(undefined);
    setError((prev) => ({
      ...prev,
      senderPhone: "Số điện thoại không hợp lệ.",
    }));
  };

  const validateReceiverPhone = (value: string) => {
    if (!value || isValidPhone(value)) {
      if (value) {
        getReceiver({ phone: value });
      }

      setError((prev) => ({ ...prev, receiverPhone: undefined }));
      return;
    }
    setReceiverName(undefined);
    setError((prev) => ({
      ...prev,
      receiverPhone: "Số điện thoại không hợp lệ.",
    }));
  };

  useEffect(() => {
    if (!senderIsFetching && senderIsSuccess && senderData?.fullName) {
      setSenderName(senderData.fullName);
    }
    if (!receiverIsFetching && receiverIsSuccess && receiverData?.fullName) {
      setReceiverName(receiverData.fullName);
    }
  }, [
    senderIsSuccess,
    receiverIsSuccess,
    receiverIsFetching,
    senderIsFetching,
  ]);

  const showKeyboard = (inputName: string, onlyNumber: boolean = true) => {
    open({
      maxLength: 10,
      onlyNumber: onlyNumber,
      inputName: inputName,
    });
  };

  return (
    <>
      <div className={`mt-8 flex flex-col px-12 gap-8`}>
        <div className="w-full">
          <Input
            label={"Số điện thoại người gửi:"}
            placeHolder={"Nhập số điện thoại người gửi"}
            onFocus={() => showKeyboard("senderPhone")}
            name={"senderPhone"}
            onChange={(value) => {
              store.dispatch(setOrderRequest({ senderPhone: value }));
              validateSenderPhone(value ?? "");
            }}
            submitError={error?.senderPhone}
            error={error?.senderPhone}
            required
          />
        </div>
        {senderName && orderRequest?.senderPhone && (
          <div>
            <div className="font-medium">Họ và tên người gửi:</div>
            <input
              type="text"
              className="rounded-lg border mt-8 border-gray-500 w-full p-4 disabled:bg-gray-100 text-gray-500"
              disabled
              value={senderName}
            />
          </div>
        )}
        <Switch
          label="Thêm người nhận"
          onChange={(value) => {
            setShowReceiver(value);
            if (!value) {
              store.dispatch(setOrderRequest({ receiverPhone: undefined }));
              store.dispatch(
                updateInputs({
                  receiverPhone: "",
                })
              );
            }
          }}
          className="w-full"
        />
        {showReceiver && (
          <>
            <div className="w-full">
              <Input
                label={"Số điện thoại người nhận:"}
                placeHolder={"Nhập số điện thoại người nhận"}
                onFocus={() => showKeyboard("receiverPhone")}
                name={"receiverPhone"}
                onChange={(value) => {
                  store.dispatch(setOrderRequest({ receiverPhone: value }));
                  validateReceiverPhone(value ?? "");
                }}
                submitError={error?.receiverPhone}
                error={error?.receiverPhone}
              />
            </div>

            {receiverName && (
              <div>
                <div className="font-medium">Họ và tên người nhận:</div>
                <input
                  type="text"
                  className="col-span-3 rounded-lg border mt-8 border-gray-500 w-full p-4 disabled:bg-gray-100 text-gray-500"
                  disabled
                  value={receiverName}
                />
              </div>
            )}
          </>
        )}
        <Button
          type={
            !error?.senderPhone && orderRequest?.senderPhone
              ? "primary"
              : "disabled"
          }
          className="mt-8 !w-full"
          small
          onClick={onSubmitCreateOrder}
        >
          Tiếp theo
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendPhoneNumber;
