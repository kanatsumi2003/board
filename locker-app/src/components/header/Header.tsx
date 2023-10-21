import { PATH, SCREEN_WAITING_TIMEOUT } from "@/constants/common";
import useCountDown from "@/hooks/useCountdown";
import useCurrent from "@/hooks/useCurrent";
import { useLazyStaffProfileQuery } from "@/services/authService";
import TokenService from "@/services/tokenService";
import { useEffect } from "react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { BiWifi } from "react-icons/bi";
import { MdSignalWifiOff, MdSignalWifiStatusbar4Bar } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "../core/Tooltip";
import { useSelector } from "react-redux";
import { AppState } from "@/stores";

interface Props {
  name?: string;
  online: boolean;
}

function Header({ name, online }: Props) {
  const [trigger, { data, isSuccess, isError, isFetching }] =
    useLazyStaffProfileQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = useCurrent();
  const { countDown, resetCountDown } = useCountDown(SCREEN_WAITING_TIMEOUT);
  const { disableCountDown } = useSelector((state: AppState) => state.global);

  const handleLogout = () => {
    TokenService.clearToken();
    navigate(PATH.HOME);
  };

  useEffect(() => {
    if (!countDown && !disableCountDown) {
      resetCountDown();
      handleLogout();
    }
  }, [countDown, disableCountDown]);

  useEffect(() => {
    if (pathname === PATH.HOME || pathname === PATH.DASHBOARD) {
      trigger();
    }
    if ((pathname === PATH.RETURN || pathname === PATH.PROCESS) && isError) {
      handleLogout();
    }
  }, [pathname]);

  useEffect(() => {
    window.addEventListener("mousemove", () => resetCountDown());
    window.addEventListener("mousedown", () => resetCountDown());
    window.addEventListener("keydown", () => resetCountDown());
    window.addEventListener("touchstart", () => resetCountDown());

    return () => {
      // Remove event listeners when the component unmounts
      window.removeEventListener("mousemove", () => resetCountDown());
      window.removeEventListener("mousedown", () => resetCountDown());
      window.removeEventListener("keydown", () => resetCountDown());
      window.removeEventListener("touchstart", () => resetCountDown());
    };
  }, []);

  return (
    <div className="px-16 py-8 bg-gray-50 justify-between shadow-sm grid grid-cols-3 items-center gap-8">
      <div className="col-span-1">
        {!isFetching && isSuccess && data?.fullName ? (
          <div className="flex gap-2 flex-wrap">
            <span>Xin chào:</span>
            <span className="font-bold line-clamp-1 overflow-hidden">
              {data?.fullName}
            </span>
          </div>
        ) : (
          <>
            {name && (
              <div className="flex gap-2">
                <span>Tủ:</span>
                <span className="font-bold line-clamp-1 overflow-hidden">
                  {name}
                </span>
              </div>
            )}
          </>
        )}
      </div>
      <div className="col-span-1 text-center">
        {current.format("hh:mm A, DD/MM/YYYY")}
      </div>
      <div className="col-span-1 flex items-center gap-4 justify-end">
        {countDown < 10 && !disableCountDown && (
          <span className="text-2xl text-red-800 w-48">{`(${countDown}s quay về màn hình chính)`}</span>
        )}
        {online ? <MdSignalWifiStatusbar4Bar /> : <MdSignalWifiOff />}
        {!isFetching && isSuccess ? (
          <Tooltip content="Đăng xuất">
            <div
              onClick={handleLogout}
              className="cursor-pointer hover:text-red-800"
            >
              <AiOutlineLogout />
            </div>
          </Tooltip>
        ) : (
          <Tooltip content="Đăng nhập với nhân viên">
            <Link to={PATH.LOGIN} className="cursor-pointer hover:text-red-800">
              <AiOutlineLogin />
            </Link>
          </Tooltip>
        )}
      </div>
    </div>
  );
}

export default Header;
