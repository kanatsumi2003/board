import { PATH } from "@/constants/common";
import BoxesContainer from "@/containers/BoxesContainer";
import useModal from "@/hooks/useModal";
import { useNavigate } from "react-router-dom";
import Title from "../Title";

function BoxesList() {
  const navigate = useNavigate();
  const modal = useModal();

  return (
    <>
      <Title subtitle="Xử lý đơn hàng">Danh sách ô tủ</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full overflow-y-auto overflow-hidden">
        <BoxesContainer
          onEmpty={() => {
            modal.error({
              message: "Locker chưa thiết lập ô tủ, vui lòng thử lại sau.",
            });
            navigate(PATH.DASHBOARD);
          }}
        />
        <div className="flex w-full items-center flex-col gap-8"></div>
      </div>
    </>
  );
}

export default BoxesList;
