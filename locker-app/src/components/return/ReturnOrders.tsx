import { PATH } from "@/constants/common";
import { useNavigate } from "react-router-dom";
import OrdersContainer from "../../containers/OrdersContainer";
import BackButton from "../core/BackButton";
import { ORDER_STATUS } from "@/interfaces/order";
import Title from "../Title";

function ReturnOrders() {
  const navigate = useNavigate();

  return (
    <>
      <Title subtitle="Hoàn trả đơn hàng">Danh sách đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
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
