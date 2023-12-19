import { PATH, SCREEN_WAITING_TIMEOUT, STAFF_PATHS } from "@/constants/common";
import useCountDown from "@/hooks/useCountdown";
import useCurrent from "@/hooks/useCurrent";
import { useStaffProfileQuery } from "@/services/authService";
import TokenService from "@/services/tokenService";
import store, { AppState } from "@/stores";
import { clearUser, setUserState } from "@/stores/user.store";
import { useEffect } from "react";
import { AiOutlineLogin, AiOutlineLogout } from "react-icons/ai";
import {
  MdOutlineArrowBackIosNew,
  MdSignalWifiOff,
  MdSignalWifiStatusbar4Bar,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "../core/Tooltip";
import useCheckBoxes from "@/hooks/useCheckBoxes";
import { useCheckBoxesQuery } from "@/services/boardService";
import { ROLE } from "@/interfaces/account";

interface Props {
  name?: string;
  online: boolean;
  code?: string;
}

function Header({ name, online, code }: Props) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const current = useCurrent();
  const { countDown, resetCountDown } = useCountDown(SCREEN_WAITING_TIMEOUT);
  const { disableCountDown } = useSelector((state: AppState) => state.global);
  const { account } = useSelector((state: AppState) => state.user);
  const { data, isSuccess, isError, isFetching } = useStaffProfileQuery(
    undefined,
    {
      skip: pathname !== PATH.DASHBOARD,
    }
  );
  const {
    data: dataCheckBoxes,
    isSuccess: checkBoxesIsSuccess,
    refetch: checkBoxesRefetch,
  } = useCheckBoxesQuery();

  const handleLogout = () => {
    TokenService.clearToken();
    navigate(PATH.HOME);
    store.dispatch(clearUser());
  };

  const handleBack = () => {
    STAFF_PATHS.includes(pathname)
      ? navigate(PATH.DASHBOARD)
      : navigate(PATH.HOME);
  };

  useEffect(() => {
    handleLogout();
  }, []);

  useEffect(() => {
    checkBoxesRefetch();
  }, [account, pathname]);

  useEffect(() => {
    if (!countDown && !disableCountDown) {
      resetCountDown();
      handleLogout();
    }
  }, [countDown, disableCountDown]);

  useEffect(() => {
    if (data) {
      store.dispatch(
        setUserState({
          account: data,
        })
      );
    }
  }, [data]);

  useEffect(() => {
    if (pathname === PATH.DASHBOARD && !isFetching && isError) {
      handleLogout();
      return;
    }
    if (!STAFF_PATHS.some((path) => pathname.includes(path)) && !!account) {
      navigate(PATH.DASHBOARD);
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
    <div className="px-12 py-8 bg-gray-50 justify-between shadow-sm grid grid-cols-3 items-center gap-4">
      <div
        className="col-span-1 flex items-center gap-2 cursor-pointer group hover:text-locker-blue"
        onClick={handleBack}
      >
        {pathname !== PATH.HOME &&
          pathname !== PATH.DASHBOARD &&
          pathname !== PATH.OFFLINE &&
          pathname !== PATH.SETUP &&
          pathname !== PATH.MAINTAINING && (
            <div className="z-30 text-6xl transition-all group-hover:-translate-x-2 -ml-2">
              <MdOutlineArrowBackIosNew />
            </div>
          )}
        {!isError && account?.fullName ? (
          <div className="flex gap-2 flex-wrap">
            <span className="font-bold line-clamp-1 overflow-hidden">
              <div className="text-ellipsis line-clamp-1">
                {account?.fullName}
              </div>
              {checkBoxesIsSuccess && (
                <>
                  {dataCheckBoxes?.closed ? (
                    <div className="bg-locker-green mt-2 px-4 py-2 text-xl font-normal rounded-2xl text-white">
                      Tất cả ô tủ đều đóng
                    </div>
                  ) : (
                    <div className="bg-locker-red mt-2 px-4 py-2 text-xl font-normal rounded-2xl text-white">
                      Có ô tủ chưa được đóng
                    </div>
                  )}
                </>
              )}
            </span>
          </div>
        ) : (
          <>
            {name && (
              <div className="flex flex-col font-bold overflow-hidden">
                <div className="text-ellipsis line-clamp-1">{name}</div>
                <div className="text-ellipsis line-clamp-1">{code}</div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="col-span-1 text-center">
        <div>{current.format("hh:mm A")}</div>
        <div>{current.format("DD/MM/YYYY")}</div>
      </div>

      <div className="col-span-1 flex items-center gap-4 justify-end  ">
        {countDown < 10 && !disableCountDown && (
          <span className="text-2xl text-red-800 w-48">{`(${countDown}s quay về màn hình chính)`}</span>
        )}
        <div
          className="hover:text-locker-blue"
          onClick={() => navigate(PATH.CONTACT)}
        >
          Liên hệ
        </div>
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
