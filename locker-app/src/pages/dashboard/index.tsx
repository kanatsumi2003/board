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
    <div className="h-full p-10 flex-col gap-12 justify-between grid grid-cols-5">
      {/* <div>
        Xin chào:{" "}
        <span className="text-3xl font-bold ml-2">{data?.fullName}</span>
      </div> */}
      <div className="col-span-3 h-full bg-dashboard bg-cover" />

      <div className="col-span-2 flex flex-col justify-between h-full flex-grow">
        <div className="flex flex-col w-full gap-4">
          <Button type="primary" to={PATH.PROCESS}>
            Xử lý đơn hàng
          </Button>
          <Button type="secondary" to={PATH.RETURN}>
            Hoàn trả đơn hàng
          </Button>
        </div>
        {/* <div
            className="text-center flex items-center gap-2 justify-center cursor-pointer hover:text-red-700 text-red-500"
            onClick={handleLogout}
          >
            <FiLogOut />
            Đăng xuất
          </div> */}
      </div>
    </div>
  );
}

export default Home;
