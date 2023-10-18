import useKeyboard from "@/hooks/useKeyboard";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Input from "../core/Input";
import LocationPicker from "./LocationPicker";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendAddress({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);

  const { open } = useKeyboard();

  const showKeyboard = (inputName: string) => {
    open({
      maxLength: 100,
      onlyNumber: false,
      inputName: inputName,
    });
  };

  const handleNext = () => {
    onNext();
  };

  useEffect(() => {
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
        <LocationPicker
          onClear={() => {
            store.dispatch(
              setOrderRequest({
                deliveryAddress: {
                  ...orderRequest?.deliveryAddress,
                  provinceCode: undefined,
                  districtCode: undefined,
                  wardCode: undefined,
                },
              })
            );
          }}
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
        <div>
          <span className="text-red-600 text-4xl font-bold">*</span> Nếu bỏ qua
          bước này, chúng tôi sẽ mặc định{" "}
          <span className="font-bold">hoàn trả tại Locker hiện tại</span> và gửi
          thông báo đến bạn.
        </div>
        <Button
          type="primary"
          className="mt-8 !w-full"
          small
          onClick={handleNext}
        >
          {orderRequest?.deliveryAddress?.address &&
          orderRequest?.deliveryAddress?.wardCode &&
          orderRequest?.deliveryAddress?.districtCode &&
          orderRequest?.deliveryAddress?.provinceCode
            ? "Tiếp theo"
            : "Bỏ qua bước này"}
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendAddress;
