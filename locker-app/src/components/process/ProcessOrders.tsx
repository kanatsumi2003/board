import { PATH } from "@/constants/common";
import { ORDER_STATUS } from "@/interfaces/order";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OrdersContainer from "../../containers/OrdersContainer";
import BackButton from "../core/BackButton";
import useModal from "@/hooks/useModal";

function ProcessOrders() {
  const navigate = useNavigate();
  const modal = useModal();

  return (
    <>
      <div className="mt-12 flex w-full items-center flex-col gap-24 h-full">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-48 rounded-b-[120px] -z-10`}
        ></div>
        <div className="text-5xl font-bold text-white">Danh sách đơn hàng</div>
        <OrdersContainer
          status={ORDER_STATUS.WAITING}
          renderLink={(id) => `${PATH.PROCESS}/${id}`}
          onEmpty={() => {
            modal.error({
              message: "Hiện không có đơn hàng nào cần xử lý",
            });
            navigate(PATH.DASHBOARD);
          }}
        />
        <div className="flex w-full items-center flex-col gap-8"></div>
      </div>
      <BackButton onClick={() => navigate(PATH.DASHBOARD)} />
    </>
  );
}

export default ProcessOrders;
