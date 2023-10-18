import LockerSetup from "@/assets/locker_setup.png";
import Button from "@/components/core/Button";
import { PATH } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { useLazyLockerInfoQuery } from "@/services/boardService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SetupPage() {
  const [getLocker, { data, isSuccess, isError, isFetching }] =
    useLazyLockerInfoQuery();
  const modal = useModal();
  const navigate = useNavigate();
  const handleRetry = () => {
    getLocker();
  };

  useEffect(() => {
    if (isSuccess && data) {
      navigate(PATH.HOME);
    }
    if (isError) {
      modal.error({
        message: "Locker chưa được kết nối, vui lòng kết nối và thử lại.",
      });
    }
  }, [isSuccess, isError]);

  return (
    <div className="p-10 h-full flex flex-col gap-8 justify-center items-center text-center">
      <img src={LockerSetup} alt="" className="object-scale-down h-[380px]" />
      <div className="text-2xl font-bold">
        Locker chưa được kết nối, vui lòng kết nối và thử lại.
      </div>
      <Button type="primary" onClick={handleRetry} className="w-[200px]" small>
        Kết nối lại
      </Button>
    </div>
  );
}

export default SetupPage;
