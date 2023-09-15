import Button from "@/components/core/Button";
import { PATH } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { IBoxItem } from "@/interfaces/box";
import { useLazyBoxesQuery } from "@/services/boxService";
import { AppState } from "@/stores";
import { useEffect } from "react";
import { TbPackage, TbPackageExport, TbPackageImport } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Home() {
  const [
    getBoxes,
    {
      data: boxes,
      isSuccess: boxesIsSuccess,
      isFetching: boxesIsFetching,
      isUninitialized: boxesIsUninitialized,
    },
  ] = useLazyBoxesQuery();
  const { locker } = useSelector((state: AppState) => state.locker);
  const navigate = useNavigate();
  const modal = useModal();

  useEffect(() => {
    if (boxesIsSuccess && boxes && !boxesIsUninitialized) {
      if (boxes.some((box: IBoxItem) => box.isAvailable && box.isActive)) {
        navigate(PATH.SEND);
      } else {
        modal.error({ message: "Không còn ô tủ trống, vui lòng quay lại sau" });
      }
    }
  }, [boxesIsFetching, boxesIsUninitialized]);

  const handleSend = () => {
    if (locker) {
      getBoxes({ id: locker?.id });
    }
  };

  return (
    <div className="h-full p-12 flex-col gap-12 justify-between grid md:grid-cols-5 xl:grid-cols-2">
      <div className="md:col-span-5 xl:col-span-1 h-full bg-home bg-cover flex-none bg-center" />
      <div className="md:col-span-5 xl:col-span-1 grid-cols-2 flex flex-col justify-between h-full flex-grow">
        <div className="flex flex-col w-full gap-6 justify-between h-full">
          <Button
            type="primary"
            className="h-full text-5xl"
            wrapperClassName="basis-1/3"
            onClick={handleSend}
            icon={<TbPackageExport />}
          >
            Gửi đồ
          </Button>
          <Button
            type="secondary"
            to={PATH.RECEIVE}
            className="h-full text-5xl"
            wrapperClassName="basis-1/3"
            icon={<TbPackageImport />}
          >
            Lấy đồ
          </Button>
          <Button
            type="secondary"
            to={PATH.RESERVE}
            className="h-full text-5xl"
            wrapperClassName="basis-1/3"
            icon={<TbPackage />}
          >
            Đặt chỗ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
