import LockerMaintaining from "@/assets/locker_maintaining.png";
import {
  LOCKER_INFO_POLLING_INTERVAL,
  PATH,
  PAYMENT_POLLING_INTERVAL,
} from "@/constants/common";
import { useLockerInfoQuery } from "@/services/boardService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
function MaintainPage() {
  const navigate = useNavigate();
  const { data, isSuccess, isFetching } = useLockerInfoQuery(undefined, {
    pollingInterval: LOCKER_INFO_POLLING_INTERVAL,
  });

  useEffect(() => {
    if (isSuccess && !isFetching && data) {
      navigate(PATH.HOME);
    }
  }, [isSuccess, isFetching]);

  return (
    <div className="p-10 h-full flex flex-col gap-12 justify-center items-center text-center">
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
