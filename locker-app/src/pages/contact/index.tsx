import Logo from "@/assets/logo/logo_full.png";
import { Card } from "@/components/core/Card";
import { AppState } from "@/stores";
import { useSelector } from "react-redux";
import QR from "@/assets/qr.jpg";

function ContactPage() {
  const { informationSettings } = useSelector(
    (state: AppState) => state.setting
  );
  return (
    <div className="p-10 h-full flex flex-col gap-24 justify-center items-center text-center">
      <img src={Logo} className="h-32"></img>
      <Card className="grid grid-cols-2 gap-y-4 gap-x-1 text-left">
        <div>Số điện thoại :</div>
        <div className="font-bold">{informationSettings?.contactPhone}</div>
        <div>Email:</div>
        <div className="font-bold">{informationSettings?.contactEmail}</div>
        <div>Giờ mở cửa:</div>
        <div className="font-bold">{informationSettings?.openedAt}</div>
        <div>Giờ đóng cửa:</div>
        <div className="font-bold">{informationSettings?.closedAt}</div>
        <div className="col-span-2 flex flex-col justify-center m-8 items-center">
          <div>Tải về ứng dụng tại:</div>
          <img src={QR} className="h-52 mt-4"></img>
        </div>
      </Card>
    </div>
  );
}

export default ContactPage;
