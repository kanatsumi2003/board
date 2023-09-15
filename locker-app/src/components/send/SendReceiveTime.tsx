import useModal from "@/hooks/useModal";
import { AppState } from "@/stores";
import dayjs from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import Button from "../core/Button";
import Select from "../core/Select";
import useKeyboard from "@/hooks/useKeyboard";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendReceiveTime({ onNext, onPrev }: Props) {
  const modal = useModal();
  const [showReceiver, setShowReceiver] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [receiverName, setReceiverName] = useState<string>();
  const [senderName, setSenderName] = useState<string>();
  const [error, setError] = useState<CreateOrderFormError>();
  const { keyboard } = useKeyboard();
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const { locker } = useSelector((state: AppState) => state.locker);

  return (
    <>
      <div className={`mt-8 flex flex-col px-12 gap-8`}>
        <div className="w-full">
          <label className="mb-2 font-medium">Chọn giờ nhận:</label>
          <Select
            data={
              [dayjs(), dayjs(), dayjs(), dayjs()]?.map((data, index) => ({
                label: data.format("DD-MM-YYYY"),
                value: data.format("DD-MM-YYYY"),
                key: index + "",
              })) ?? []
            }
            className="mt-4"
            name="province"
            placeholder="Chọn Tỉnh/Thành phố"
            onChange={(value) => {}}
            onClear={() => {}}
            menuPlacement="bottom"
          />
        </div>
        <Button type="primary" className="mt-8" small onClick={onNext}>
          Tiếp theo
        </Button>
      </div>
      <BackButton onClick={onPrev} />
    </>
  );
}

export default SendReceiveTime;
