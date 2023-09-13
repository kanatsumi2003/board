import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { setOrderRequest } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import Button from "../core/Button";
import Input from "../core/Input";
import LocationPicker from "./LocationPicker";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendAddress({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);

  const showKeyboard = (inputName: string) => {
    store.dispatch(
      setGlobalState({
        keyboard: {
          maxLength: 100,
          onlyNumber: false,
          inputName: inputName,
        },
      })
    );
  };

  useEffect(() => {
    store.dispatch(
      updateInputs({
        senderPhone: "",
        receiverPhone: "",
      })
    );
    showKeyboard("address");
  }, []);

  return (
    <>
      <div className={`mt-8 flex flex-col px-12 gap-8`}>
        <Input
          label={"Địa chỉ nhận hàng:"}
          placeHolder={"Nhập địa chỉ nhận hàng"}
          onFocus={() => showKeyboard("address")}
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
        <Button type="primary" className="mt-8 !w-full" small onClick={onNext}>
          Tiếp theo
        </Button>
        <BackButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendAddress;
