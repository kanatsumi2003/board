import Logo from "@/assets/logo/logo_full.png";
import Button from "@/components/core/Button";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import useModal from "@/hooks/useModal";
import { IBoxItem } from "@/interfaces/box";
import { useLazyBoxesQuery } from "@/services/boxService";
import store, { AppState } from "@/stores";
import { clearOrder } from "@/stores/order.store";
import { useEffect } from "react";
import { MdAccountBalanceWallet } from "react-icons/md";
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
  const { clear, inputs } = useKeyboard();

  useEffect(() => {
    if (boxesIsSuccess && boxes && !boxesIsUninitialized) {
      if (boxes.some((box: IBoxItem) => box.isAvailable && box.isActive)) {
        navigate(PATH.SEND);
      } else {
        modal.error({ message: "Không còn ô tủ trống, vui lòng quay lại sau" });
      }
    }
  }, [boxesIsFetching, boxesIsUninitialized]);

  useEffect(() => {
    store.dispatch(clearOrder());
  }, []);

  const handleSend = () => {
    if (locker) {
      getBoxes({ id: locker?.id });
    }
  };

  useEffect(() => {
    clear();
  }, []);

  return (
    <div className="h-full p-12 flex-col gap-12 justify-between grid xl:grid-cols-2 grid-cols-1 grid-rows-4 xl:grid-rows-none">
      <div className="flex flex-col col-span-1 gap-4 h-full row-span-2 xl:row-span-full">
        <div className="h-32 flex justify-center items-center">
          <img src={Logo} className="h-32"></img>
        </div>
        <div className="flex-1 bg-home bg-cover bg-center" />
      </div>
      <div className="col-span-1 grid-cols-2 flex flex-col justify-between h-full flex-grow row-span-2 xl:row-span-full">
        <div className="flex flex-col w-full gap-6 justify-between h-full">
          <Button
            type="primary"
            className="h-full text-6xl"
            wrapperClassName="basis-1/4"
            onClick={handleSend}
            icon={<TbPackageExport />}
          >
            Gửi đồ
          </Button>
          <Button
            type="secondary"
            to={PATH.RECEIVE}
            className="h-full text-6xl"
            wrapperClassName="basis-1/4"
            icon={<TbPackageImport />}
          >
            Lấy đồ
          </Button>

          <Button
            type="warning"
            to={`${PATH.LOOK_UP}?a=1231`}
            className="h-full text-6xl"
            wrapperClassName="basis-1/4"
            icon={<MdAccountBalanceWallet />}
          >
            Tra cứu
          </Button>

          <div className="flex w-full gap-6 justify-between">
            <Button
              type="warning"
              className="h-full text-5xl"
              wrapperClassName="basis-1/2"
              to={PATH.ADD_MORE}
              icon={<TbPackageExport />}
            >
              Gửi thêm đồ
            </Button>
            <Button
              type="warning"
              to={PATH.RESERVE}
              className="h-full text-5xl"
              wrapperClassName="basis-1/2"
              icon={<TbPackage />}
            >
              Đã đặt chỗ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
