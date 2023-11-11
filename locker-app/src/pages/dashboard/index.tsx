import Logo from "@/assets/logo/logo_full.png";
import Button from "@/components/core/Button";
import { PATH } from "@/constants/common";
import TokenService from "@/services/tokenService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  useEffect(() => {
    if (!TokenService.getAccessToken() && !TokenService.getRefreshToken()) {
      navigate(PATH.HOME);
    }
  }, []);

  const navigate = useNavigate();
  return (
    <div className="h-full p-12 flex-col gap-12 justify-between grid xl:grid-cols-2 grid-cols-1 grid-rows-4 xl:grid-rows-none">
      <div className="flex flex-col col-span-1 gap-4 h-full row-span-2 xl:row-span-full">
        <div className="h-32 flex justify-center items-center">
          <img src={Logo} className="h-32"></img>
        </div>
        {/* <div className="flex-1 bg-home bg-cover bg-center" /> */}
        <div className="col-span-5 h-full bg-dashboard bg-cover bg-center" />
      </div>
      <div className="col-span-1 grid-cols-2 flex flex-col justify-between h-full flex-grow row-span-2 xl:row-span-full">
        <div className="flex flex-col w-full gap-6 justify-between h-full">
          <Button
            type="primary"
            to={PATH.PROCESS}
            wrapperClassName="basis-1/2"
            className="h-full text-6xl"
          >
            Xử lý đơn hàng
          </Button>
          <Button
            type="secondary"
            to={PATH.RETURN}
            className="h-full text-6xl"
            wrapperClassName="basis-1/2"
          >
            Hoàn trả đơn hàng
          </Button>
          <Button
            type="warning"
            to={PATH.OPEN_BOX}
            className="h-full text-6xl"
            wrapperClassName="basis-1/2"
          >
            Mở tủ
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
