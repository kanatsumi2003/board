import { useLazyCustomerByPhoneQuery } from "@/services/customerService";
import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { setOrderRequest } from "@/stores/order.store";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
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
  const [showReceiver, setShowReceiver] = useState(false);
  const [receiverName, setReceiverName] = useState<string>();
  const [senderName, setSenderName] = useState<string>();
  const [error, setError] = useState<CreateOrderFormError>();
  const { orderRequest } = useSelector((state: AppState) => state.order);

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
        senderPhone: "",
        receiverPhone: "",
      })
    );
    showKeyboard("senderPhone");
  }, []);

  const validateSenderPhone = (value: string) => {
    if (!value || isValidPhone(value)) {
      if (value) {
        getSender({ phone: value });
      }

      return undefined;
    }
    setSenderName(undefined);
    return "Số điện thoại không hợp lệ.";
  };

  const validateReceiverPhone = (value: string) => {
    if (!value || isValidPhone(value)) {
      if (value) {
        getReceiver({ phone: value });
      }

      return undefined;
    }
    setReceiverName(undefined);
    return "Số điện thoại không hợp lệ.";
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
    store.dispatch(
      setGlobalState({
        keyboard: {
          maxLength: 10,
          onlyNumber: onlyNumber,
          inputName: inputName,
        },
      })
    );
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
            validate={validateSenderPhone}
            onChange={(value) => {
              store.dispatch(setOrderRequest({ senderPhone: value }));
              setError((prev) => ({ ...prev, senderPhone: undefined }));
            }}
            submitError={error?.senderPhone}
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
                validate={validateReceiverPhone}
                name={"receiverPhone"}
                onChange={(value) => {
                  store.dispatch(setOrderRequest({ receiverPhone: undefined }));

                  setError((prev) => ({ ...prev, address: undefined }));
                }}
                submitError={error?.receiverPhone}
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
          type="primary"
          className="mt-8 !w-full"
          small
          onClick={onSubmitCreateOrder}
        >
          Tiếp theo
        </Button>
        <BackButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendPhoneNumber;
