import { PATH } from "@/constants/common";
import { useNavigate } from "react-router-dom";
import OrdersContainer from "../../containers/OrdersContainer";
import BackButton from "../core/BackButton";
import { ORDER_STATUS } from "@/interfaces/order";

function ReturnOrders() {
  const navigate = useNavigate();

  return (
    <>
      <div className="mt-6 flex w-full items-center flex-col gap-24 h-full">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
        ></div>
        <div className="text-5xl font-bold text-white">Danh sách đơn hàng</div>
        <OrdersContainer
          status={ORDER_STATUS.PROCESSING}
          renderLink={(id) => `${PATH.RETURN}/${id}`}
        />
        <div className="flex w-full items-center flex-col gap-8"></div>
      </div>
      <BackButton onClick={() => navigate(PATH.DASHBOARD)} />
    </>
  );
}

export default ReturnOrders;
