import useModal from "@/hooks/useModal";
import { ORDER_TYPE } from "@/interfaces/order";
import { useLazyCustomerByPhoneQuery } from "@/services/customerService";
import { useCreateOrderMutation } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { setOrderRequest, setOrderState } from "@/stores/order.store";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import Button from "../core/Button";
import Input from "../core/Input";
import Switch from "../core/Switch";
import LocationPicker from "./LocationPicker";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendCreateOrder({ onNext, onPrev }: Props) {
  const modal = useModal();
  const [showReceiver, setShowReceiver] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [receiverName, setReceiverName] = useState<string>();
  const [senderName, setSenderName] = useState<string>();
  const [error, setError] = useState<CreateOrderFormError>();
  const { keyboard } = useSelector((state: AppState) => state.global);
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const { locker } = useSelector((state: AppState) => state.locker);
  const [
    createOrder,
    {
      isSuccess: createOrderIsSuccess,
      isError: createOrderIsError,
      data: createOrderData,
      error: createOrderError,
    },
  ] = useCreateOrderMutation();
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
      createOrder({
        lockerId: Number(locker?.id),
        senderPhone: orderRequest?.senderPhone,
        receiverPhone: orderRequest?.receiverPhone,
        type: orderRequest?.type,
        serviceIds: orderRequest?.serviceIds,
        deliveryAddress: orderRequest.deliveryAddress,
      });
    }
  };

  useEffect(() => {
    if (createOrderIsSuccess) {
      store.dispatch(
        setOrderState({
          order: createOrderData,
        })
      );
      onNext();
    }
    if (createOrderIsError && createOrderError) {
      modal.error({ message: createOrderError?.message?.message });
    }
  }, [createOrderIsSuccess, createOrderIsError]);

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
      <div
        className={`mt-4 flex flex-col px-20 gap-4 ${
          keyboard ? "h-[calc(100vh-680px)]" : "h-[calc(100vh-400px)]"
        } overflow-y-scroll `}
      >
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
          />
        </div>
        {senderName && orderRequest?.senderPhone && (
          <div className="w-full">
            <label className="mb-2 text-sm font-medium">
              Họ và tên người gửi:
            </label>
            <input
              type="text"
              className="rounded-lg border border-gray-500 w-full p-2.5 mt-2 disabled:bg-gray-100 text-gray-500"
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
              <div className="w-full">
                <label className="mb-2 text-sm font-medium">
                  Họ và tên người nhận:
                </label>
                <input
                  type="text"
                  className="col-span-3 rounded-lg border border-gray-500 w-full p-2.5 mt-2 disabled:bg-gray-100 text-gray-500"
                  disabled
                  value={receiverName}
                />
              </div>
            )}
          </>
        )}
        {orderRequest?.type === ORDER_TYPE.LAUNDRY && (
          <>
            <Switch
              label="Thêm địa chỉ giao hàng"
              onChange={(value) => {
                setShowAddress(value);
                if (!value) {
                  store.dispatch(
                    setOrderRequest({
                      deliveryAddress: undefined,
                    })
                  );
                  store.dispatch(
                    updateInputs({
                      address: "",
                      province: "",
                      district: "",
                      ward: "",
                    })
                  );
                }
              }}
              className="w-full"
            />
            {showAddress && (
              <>
                <Input
                  label={"Địa chỉ nhận hàng:"}
                  placeHolder={"Nhập địa chỉ nhận hàng"}
                  onFocus={() => showKeyboard("address", false)}
                  name={"address"}
                  onChange={(value) => {
                    store.dispatch(
                      setOrderRequest({
                        deliveryAddress: {
                          ...orderRequest?.deliveryAddress,
                          address: value,
                        },
                      })
                    );
                  }}
                />
                <LocationPicker
                  onChange={({ province, district, ward }) => {
                    store.dispatch(
                      setOrderRequest({
                        deliveryAddress: {
                          ...orderRequest?.deliveryAddress,
                          provinceCode: province,
                          districtCode: district,
                          wardCode: ward,
                        },
                      })
                    );
                  }}
                />
              </>
            )}
          </>
        )}
      </div>
      <div className="px-20">
        <Button
          type="primary"
          className="mt-8 !w-fit"
          small
          onClick={onSubmitCreateOrder}
        >
          Tiếp theo
        </Button>
      </div>
      <BackButton onClick={onPrev} />
    </>
  );
}

export default SendCreateOrder;
