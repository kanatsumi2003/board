import useCheckBoxes from "@/hooks/useCheckBoxes";
import useModal from "@/hooks/useModal";
import { useConfirmOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import BoxNumber from "../core/BoxNumber";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

export default function AddMoreSuccess({ onNext }: Props) {
  const { order } = useSelector((state: AppState) => state.order);

  const { checkBoxes, isLoading: checkBoxesIsLoading } = useCheckBoxes({
    onError: (reCheck) => {
      modal.confirm({
        message: "Có ô tủ chưa được đóng chặc, bạn có chắc sẽ bỏ qua chứ?",
        onOk: () => order && confirmOrder({ id: order?.id }),
        onClose: reCheck,
      });
    },

    onSuccess: () => order && confirmOrder({ id: order?.id }),
  });

  const [confirmOrder, { isSuccess, isError, error }] =
    useConfirmOrderMutation();
  const modal = useModal();
  const handleConfirmOrder = () => {
    checkBoxes();
  };

  useEffect(() => {
    if (isSuccess) {
      onNext();
      modal.success({
        message: "Cảm ơn bạn đã sử dụng dịch vụ.",
      });
      return;
    }
    if (isError && error) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Gửi thêm đồ">Vui lòng để đồ vào ô tủ số</Title>
      <div className="flex w-full items-center flex-col justify-between h-full mt-52">
        <div className="text-center">
          Vui lòng để đồ vào tủ và ấn <b>"Xác nhận"</b> trên màn hình để hoàn
          tất.
        </div>
        <BoxNumber>{order?.sendBox?.number}</BoxNumber>
        <Button
          type={checkBoxesIsLoading ? "disabled" : "primary"}
          small
          onClick={handleConfirmOrder}
        >
          Xác nhận
        </Button>
      </div>
    </>
  );
}
