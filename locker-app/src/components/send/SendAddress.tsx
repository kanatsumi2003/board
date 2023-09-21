import useKeyboard from "@/hooks/useKeyboard";
import { IAddress, ILocation } from "@/interfaces";
import store, { AppState } from "@/stores";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Input from "../core/Input";
import LocationPicker from "./LocationPicker";
import { setOrderRequest } from "@/stores/order.store";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendAddress({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [address, setAddress] = useState<Partial<IAddress> | undefined>(
    orderRequest?.deliveryAddress
  );
  const { open } = useKeyboard();

  const showKeyboard = (inputName: string) => {
    open({
      maxLength: 100,
      onlyNumber: false,
      inputName: inputName,
    });
  };

  const handleNext = () => {
    store.dispatch(
      setOrderRequest({
        deliveryAddress: address,
      })
    );
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
            setAddress((prev) => ({
              ...prev,
              address: value,
            }));
          }}
        />
        <LocationPicker
          onChange={({ province, district, ward }) => {
            setAddress((prev) => ({
              ...prev,
              provinceCode: province,
              districtCode: district,
              wardCode: ward,
            }));
          }}
        />
        <Button
          type="primary"
          className="mt-8 !w-full"
          small
          onClick={handleNext}
        >
          {Object.values(orderRequest?.deliveryAddress ?? {}).filter(
            (value) => !!value
          ).length > 0
            ? "Tiếp theo"
            : "Bỏ qua bước này"}
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendAddress;
