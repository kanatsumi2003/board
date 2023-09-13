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
    <div className="h-full p-12 flex-col gap-12 justify-between grid grid-cols-5">
      <div className="col-span-5 h-full bg-dashboard bg-cover" />
      <div className="col-span-5 flex flex-col justify-between h-full flex-grow">
        <div className="flex flex-col w-full gap-6 justify-between h-full">
          <Button
            type="primary"
            to={PATH.PROCESS}
            wrapperClassName="basis-1/2"
            className="h-full text-5xl"
          >
            Xử lý đơn hàng
          </Button>
          <Button
            type="secondary"
            to={PATH.RETURN}
            className="h-full text-5xl"
            wrapperClassName="basis-1/2"
          >
            Hoàn trả đơn hàng
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Home;
