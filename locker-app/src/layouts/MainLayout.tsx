import VirtualKeyboard from "@/components/core/Keyboard";
import Message from "@/components/core/Message";
import Header from "@/components/header/Header";
import { LOCAL_STORAGE_ITEMS, PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import useModal from "@/hooks/useModal";
import { LOCKER_STATUS } from "@/interfaces/locker";
import { useLockerInfoQuery } from "@/services/boardService";
import { useSettingQuery } from "@/services/settingService";
import TokenService from "@/services/tokenService";
import store, { AppState } from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { setLockerState } from "@/stores/locker.store";
import { setSettingState } from "@/stores/setting.store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  children: JSX.Element;
}

function MainLayout({ children }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const { keyboard, close } = useKeyboard();
  const location = useLocation();
  const navigate = useNavigate();
  const modal = useModal();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { data, isSuccess, isError, refetch, isFetching } =
    useLockerInfoQuery();
  const {
    data: setting,
    isSuccess: settingIsSuccess,
    refetch: settingRefetch,
  } = useSettingQuery(undefined, { skip: !isSuccess });
  const { pathname } = useLocation();

  useEffect(() => {
    if (settingIsSuccess) {
      store.dispatch(setSettingState(setting));
    }
  }, [settingIsSuccess]);

  useEffect(() => {
    if (isSuccess && data && data.locker_status === LOCKER_STATUS.ACTIVE) {
      localStorage.setItem(LOCAL_STORAGE_ITEMS.API_KEY, data.api_key);
      localStorage.setItem(LOCAL_STORAGE_ITEMS.BASE_URL, data.api_host);
      localStorage.setItem(LOCAL_STORAGE_ITEMS.LOCKER_ID, data.locker_id);

      store.dispatch(
        setLockerState({
          locker: {
            id: Number(data.locker_id),
            code: data.locker_code,
            name: data.locker_name,
            status: data.locker_status,
            apiHost: data.api_host,
            apiKey: data.api_key,
          },
        })
      );
      if (pathname === PATH.SETUP) {
        navigate(PATH.HOME);
      }
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ITEMS.API_KEY);
      localStorage.removeItem(LOCAL_STORAGE_ITEMS.BASE_URL);
      localStorage.removeItem(LOCAL_STORAGE_ITEMS.LOCKER_ID);

      store.dispatch(
        setLockerState({
          locker: undefined,
        })
      );
      navigate(PATH.HOME);
    }
  }, [isSuccess, isError, isFetching]);

  const onChangeAll = (inputs: { [key: string]: string }) => {
    store.dispatch(
      setGlobalState({
        inputs: inputs,
      })
    );
  };

  useEffect(() => {
    close();

    if (location.pathname === PATH.HOME) {
      refetch();
      isSuccess && settingRefetch();
    }
  }, [location.pathname]);

  useEffect(() => {
    // Update network status
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    // Listen to the online status
    window.addEventListener("online", handleStatusChange);

    // Listen to the offline status
    window.addEventListener("offline", handleStatusChange);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      TokenService.clearToken();
      navigate(PATH.OFFLINE);
    } else if (isOnline && location.pathname === PATH.OFFLINE) {
      modal.success({
        message: "Đã có kết nối mạng trở lại",
        onClose: () => navigate(PATH.HOME),
      });
    }
  }, [isOnline]);

  return (
    <div className="bg-white relative overflow-hidden h-screen w-screen items-center text-3xl leading-tight">
      <div className="flex flex-col h-full">
        <Header name={locker?.name} online={isOnline} />
        <div className="relative h-full z-0 max-h-[calc(100%-101px)]">
          {children}
        </div>
      </div>
      <VirtualKeyboard
        inputName={keyboard?.inputName}
        onChangeAll={onChangeAll}
        maxLength={keyboard?.maxLength ?? 6}
        show={!!keyboard}
        onlyNumber={keyboard?.onlyNumber}
        uppercase={keyboard?.uppercase}
      />
      <Message />
    </div>
  );
}

export default MainLayout;
