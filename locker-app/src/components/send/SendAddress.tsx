import useKeyboard from "@/hooks/useKeyboard";
import { ILocation } from "@/interfaces";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { checkLocation } from "@/utils/utils";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Input from "../core/Input";
import LocationPicker from "./LocationPicker";
import Asterisk from "../core/Asterisk";
import TextBold from "../core/TextBold";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendAddress({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);

  const { open, clear } = useKeyboard();

  const showKeyboard = (inputName: string) => {
    open({
      maxLength: 100,
      onlyNumber: false,
      inputName: inputName,
    });
  };

  const handleClear = () => {
    clear(["address"]);
    store.dispatch(
      setOrderRequest({
        deliveryAddress: undefined,
      })
    );
  };

  const handleNext = () => {
    if (
      !orderRequest?.deliveryAddress?.address ||
      !checkLocation(orderRequest.deliveryAddress)
    ) {
      handleClear();
    }
    onNext();
  };

  useEffect(() => {
    showKeyboard("address");
  }, []);

  const handleChangeLocation = (location: ILocation) => {
    store.dispatch(
      setOrderRequest({
        deliveryAddress: {
          ...location,
          address: orderRequest?.deliveryAddress?.address,
        },
      })
    );
  };

  return (
    <>
      <div className={`mt-8 flex flex-col px-12 gap-8`}>
        <Input
          label={"Địa chỉ nhận hàng:"}
          placeHolder={"Nhập địa chỉ nhận hàng"}
          onFocus={() => showKeyboard("address")}
          name={"address"}
          value={orderRequest?.deliveryAddress?.address}
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
        <LocationPicker onClear={handleClear} onChange={handleChangeLocation} />
        <div>
          <Asterisk /> Nếu bỏ qua bước này, chúng tôi sẽ mặc định{" "}
          <TextBold>hoàn trả tại Locker hiện tại</TextBold> và gửi thông báo đến
          bạn.
        </div>
        <Button
          type="primary"
          className="mt-8 !w-full"
          small
          onClick={handleNext}
        >
          {orderRequest?.deliveryAddress?.address &&
          checkLocation(orderRequest?.deliveryAddress)
            ? "Tiếp theo"
            : "Bỏ qua bước này"}
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendAddress;
