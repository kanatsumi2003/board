import useModal from "@/hooks/useModal";
import { useLazyCheckBoxesQuery } from "@/services/boardService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import BoxNumber from "../core/BoxNumber";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
}

function ReturnSuccess({ onNext }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const modal = useModal();

  const [
    checkBoxes,
    {
      isSuccess: checkBoxIsSuccess,
      isError: checkBoxesIsError,
      isLoading: checkBoxesIsLoading,
      isFetching: checkBoxesIsFetching,
      error: checkBoxesError,
      data: checkBoxesData,
      isUninitialized: checkBoxesIsUninitialized,
    },
  ] = useLazyCheckBoxesQuery();

  const handleNext = () => {
    checkBoxes();
  };

  useEffect(() => {
    if (
      checkBoxesIsUninitialized &&
      checkBoxesIsFetching &&
      !checkBoxIsSuccess
    ) {
      return;
    }
    if (order && checkBoxesData?.closed) {
      modal.success({ message: "Hoàn trả thành công" });
      onNext();
    }
    if (!checkBoxesData?.closed) {
      modal.error({
        message: "Vui lòng đóng chặt tủ để hoàn tất!",
      });
    }
  }, [checkBoxIsSuccess, checkBoxesIsError, checkBoxesIsFetching]);

  // const handleNext = () => {
  //   onNext();
  //   modal.success({ message: "Hoàn trả thành công" });
  // };
  return (
    <>
      <Title subtitle="Hoàn trả đơn hàng">
        Vui lòng hoàn trả đồ đã xử lý ở ô tủ số
      </Title>
      <div className="mt-52 flex w-full items-center flex-col justify-between h-full px-12">
        <div>
          Vui lòng hoàn trả đồ và ấn "Xác nhận" trên màn hình để hoàn tất.
        </div>
        <BoxNumber>{order?.receiveBox?.number}</BoxNumber>
        <Button type="primary" small onClick={handleNext}>
          Xác nhận
        </Button>
      </div>
    </>
  );
}

export default ReturnSuccess;
