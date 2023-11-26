import { PATH } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { ORDER_STATUS } from "@/interfaces/order";
import { useNavigate } from "react-router-dom";
import OrdersContainer from "../../containers/OrdersContainer";
import Title from "../Title";

function ReturnOrders() {
  const navigate = useNavigate();
  const modal = useModal();

  return (
    <>
      <Title subtitle="Hoàn trả đơn hàng">Danh sách đơn hàng</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <OrdersContainer
          status={ORDER_STATUS.PROCESSED}
          deliverySupported={false}
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
    </>
  );
}

export default ReturnOrders;
