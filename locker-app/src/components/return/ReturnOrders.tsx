import { PATH } from "@/constants/common";
import { useNavigate } from "react-router-dom";
import OrdersContainer from "../../containers/OrdersContainer";
import BackButton from "../core/BackButton";
import { ORDER_STATUS } from "@/interfaces/order";
import Title from "../Title";
import useModal from "@/hooks/useModal";

function ReturnOrders() {
  const navigate = useNavigate();
  const modal = useModal();

  return (
    <>
      <Title subtitle="Hoàn trả đơn hàng">Danh sách đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <OrdersContainer
          status={ORDER_STATUS.PROCESSED}
          renderLink={(id) => `${PATH.RETURN}/${id}`}
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

export default ReturnOrders;
