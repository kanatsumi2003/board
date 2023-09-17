import { PATH } from "@/constants/common";
import { ORDER_STATUS } from "@/interfaces/order";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import OrdersContainer from "../../containers/OrdersContainer";
import BackButton from "../core/BackButton";
import useModal from "@/hooks/useModal";
import Title from "../Title";

function ProcessOrders() {
  const navigate = useNavigate();
  const modal = useModal();

  return (
    <>
      <Title subtitle="Xử lý đơn hàng">Xử lý đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
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
