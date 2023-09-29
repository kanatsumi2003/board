import useModal from "@/hooks/useModal";
import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import Title from "../Title";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ReceiveSuccess({ onNext }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const modal = useModal();
  const handleNext = () => {
    onNext();
    modal.success({ message: "Cảm ơn bạn đã sử dụng dịch vụ" });
  };

  return (
    <>
      <Title subtitle="Nhận đồ">Vui lòng nhận đồ ở ô tủ số</Title>
      <div className="flex w-full items-center flex-col justify-between h-full mt-52">
        <div className="text-center">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất.
        </div>
        <div className="text-[160px] font-bold text-locker-blue p-4 rounded-full">
          {order?.receiveBox?.number}
        </div>
        <Button type="primary" small onClick={handleNext}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}

export default ReceiveSuccess;
