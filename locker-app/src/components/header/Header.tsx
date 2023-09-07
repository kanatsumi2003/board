import { PATH } from "@/constants/common";
import useCountDown from "@/hooks/useCountdown";
import useCurrent from "@/hooks/useCurrent";
import { useLazyStaffProfileQuery } from "@/services/authService";
import TokenService from "@/services/tokenService";
import { useEffect } from "react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import { MdSignalCellular4Bar, MdSignalCellularOff } from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "../core/Tooltip";
function Header({ name, online }: { name?: string; online: boolean }) {
  const [trigger, { data, isSuccess, isError, isFetching }] =
    useLazyStaffProfileQuery();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = useCurrent();
  const { countDown, resetCountDown } = useCountDown(100);

  const handleLogout = () => {
    TokenService.clearToken();
    navigate(PATH.HOME);
  };

  useEffect(() => {
    if (!countDown) {
      resetCountDown();
      handleLogout();
    }
  }, [countDown]);

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
    <div className="px-10 py-4 bg-gray-50 justify-between shadow-sm grid grid-cols-3 items-center">
      <div className="col-span-1">
        {!isFetching && isSuccess && data?.fullName ? (
          <>
            Xin chào:{" "}
            <span className="text-xl font-bold ml-2">{data?.fullName}</span>
          </>
        ) : (
          <>
            {name && (
              <>
                Tủ: <span className="text-xl font-bold ml-2">{name}</span>
              </>
            )}
          </>
        )}
      </div>
      <div className="col-span-1 text-center">
        {current.format("hh:mm A, DD/MM/YYYY")}
      </div>
      <div className="col-span-1 text-2xl flex items-center gap-4 justify-end">
        {countDown < 10 && (
          <span className="text-base text-red-800">{`(${countDown}s quay về màn hình chính)`}</span>
        )}
        {online ? <MdSignalCellular4Bar /> : <MdSignalCellularOff />}
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
