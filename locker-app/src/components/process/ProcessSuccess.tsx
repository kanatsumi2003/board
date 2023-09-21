import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import useModal from "@/hooks/useModal";
import Title from "../Title";

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
      <Title>Vui lòng nhận đồ cần xử lý ở ô tủ số</Title>
      <div className="mt-52 flex w-full items-center flex-col justify-between h-full">
        <div className="text-center">
          Vui lòng nhận đồ và ấn "Xác nhận" trên màn hình để hoàn tất.
        </div>

        <div className="text-[160px] font-bold text-locker-blue p-4 rounded-full">
          {order?.sendBox?.number}
        </div>
        <Button type="primary" small onClick={handleNext}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}

export default ProcessSuccess;
