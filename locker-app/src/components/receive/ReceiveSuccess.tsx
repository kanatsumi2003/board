import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import useModal from "@/hooks/useModal";

function ReceiveSuccess({ onNext }: { onNext: () => void }) {
  const { order } = useSelector((state: AppState) => state.order);
  const modal = useModal();
  const handleNext = () => {
    onNext();
    modal.success({ message: "Cảm ơn bạn đã sử dụng dịch vụ" });
  };

  return (
    <div className="mt-8 flex w-full items-center flex-col justify-between h-full">
      <div
        className={`absolute top-0 left-0 right-0 bg-locker-blue h-48 rounded-b-[120px] -z-10`}
      ></div>
      <div className="text-center text-white">
        <div className="text-3xl font-bold ">Vui lòng nhận đồ ở ô tủ số</div>
        <div className="mt-4">
          Vui lòng để đồ vào tủ và ấn "Xác nhận" trên màn hình để hoàn tất.
        </div>
      </div>
      <div className="text-[160px] font-bold text-locker-blue p-4 rounded-full">
        {order?.receiveBox?.number}
      </div>
      <Button type="primary" small onClick={handleNext}>
        Xác nhận
      </Button>
    </div>
  );
}

export default ReceiveSuccess;
