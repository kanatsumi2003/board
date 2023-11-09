import useModal from "@/hooks/useModal";
import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import Title from "../Title";
import BoxNumber from "../core/BoxNumber";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ProcessSuccess({ onNext }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const modal = useModal();

  const handleNext = () => {
    onNext();
    modal.success({ message: "Nhận đồ thành công." });
  };
  return (
    <>
      <Title subtitle="Xử lý đơn hàng">
        Vui lòng nhận đồ cần xử lý ở ô tủ số
      </Title>
      <div className="mt-52 flex w-full items-center flex-col justify-between h-full">
        <div className="text-center">
          Vui lòng nhận đồ và ấn <b>"Xác nhận"</b> trên màn hình để hoàn tất.
        </div>
        <BoxNumber>{order?.sendBox?.number}</BoxNumber>
        <Button type="primary" small onClick={handleNext}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}

export default ProcessSuccess;
