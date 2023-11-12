import LockerMaintaining from "@/assets/locker_maintaining.png";
import Logo from "@/assets/logo/logo_full.png";
import { LOCKER_INFO_POLLING_INTERVAL, PATH } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { useLockerInfoQuery } from "@/services/boardService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MaintainPage() {
  const navigate = useNavigate();
  const { data, isSuccess, isFetching } = useLockerInfoQuery(undefined, {
    pollingInterval: LOCKER_INFO_POLLING_INTERVAL,
  });
  const modal = useModal();

  useEffect(() => {
    if (isSuccess && !isFetching && data) {
      modal.success({
        message: `Kết nối thành công đến locker ${data.locker_code}`,
        onClose: () => navigate(PATH.HOME),
      });
    }
  }, [isSuccess, isFetching]);

  return (
    <div className="p-10 h-full flex flex-col justify-center items-center text-center gap-24">
      <img src={Logo} className="h-32"></img>
      <img
        src={LockerMaintaining}
        alt=""
        className="object-scale-down h-[400px]"
      />
      <div className="font-bold">
        Locker hiện đang tạm ngưng để bảo trì <br /> Bạn vui lòng thử lại sau.
      </div>
    </div>
  );
}

export default MaintainPage;
