import useKeyboard from "@/hooks/useKeyboard";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Textarea from "../core/Textarea";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendNote({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);

  const { open } = useKeyboard();

  const showKeyboard = (inputName: string) => {
    open({
      maxLength: 500,
      onlyNumber: false,
      inputName: inputName,
    });
  };

  const handleNext = () => {
    onNext();
  };

  useEffect(() => {
    showKeyboard("customerNote");
  }, []);

  return (
    <>
      <div className={`mt-8 flex flex-col px-12 gap-8`}>
        <Textarea
          label={"Ghi chú đơn hàng:"}
          placeHolder={"Nhập chú đơn hàng"}
          onFocus={() => showKeyboard("customerNote")}
          name={"customerNote"}
          value={orderRequest?.customerNote}
          onChange={(value) => {
            store.dispatch(
              setOrderRequest({
                customerNote: value,
              })
            );
          }}
        />
        <Button
          type="primary"
          className="mt-8 !w-full"
          small
          onClick={handleNext}
        >
          {orderRequest?.customerNote ? "Tiếp theo" : "Bỏ qua bước này"}
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendNote;
