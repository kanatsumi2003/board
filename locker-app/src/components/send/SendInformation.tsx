import { ORDER_TYPE } from "@/interfaces/order";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useEffect, useState } from "react";
import SendChooseType from "./SendChooseType";
import SendServices from "./SendServices";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import { Card } from "../core/Card";
import TextBold from "../core/TextBold";
import { useShippingPriceQuery } from "@/services/shippingPriceService";
import { formatCurrency } from "@/utils/formatter";

interface Props {
  onNext: () => void;
}

function SendInformation({ onNext }: Props) {
  const { orderSettings } = useSelector((app: AppState) => app.setting);
  const { data } = useShippingPriceQuery();

  return (
    <div className="px-16 flex flex-col gap-8">
      <TextBold className="text-5xl font-bold text-center mt-8">
        Thông tin lưu ý
      </TextBold>
      <Card className="">
        <TextBold>Điều khoản đơn hàng</TextBold>
        <div className="grid grid-cols-5 mt-4 gap-2 items-end">
          {orderSettings?.extraFee && (
            <>
              <div className="col-span-3">Phí trả trước khi đặt hàng:</div>
              <TextBold className="text-end col-span-2">
                {formatCurrency(orderSettings?.reservationFee ?? 0)}
              </TextBold>
            </>
          )}
          <>
            <div className="col-span-3">Phí dịch vụ giữ đồ:</div>
            <TextBold className="text-end col-span-2">
              {`${formatCurrency(orderSettings?.storagePrice ?? 0)}/giờ`}
            </TextBold>
          </>
          <>
            <div className="col-span-3">Thời gian chờ khởi tạo đơn hàng:</div>
            <TextBold className="text-end col-span-2">
              {`${orderSettings?.initTimeoutInMinutes} phút`}
            </TextBold>
          </>
          <>
            <div className="col-span-3">Số lượng đơn hàng tối đa:</div>
            <TextBold className="text-end col-span-2">
              {`${orderSettings?.maxActiveOrderCount} đơn/khách hàng`}
            </TextBold>
          </>
          <>
            <div className="col-span-3">
              Thời gian tối thiểu để xử lý đơn hàng giặt sấy:
            </div>
            <TextBold className="text-end col-span-2">
              {`${orderSettings?.minTimeProcessLaundryOrderInHours} giờ`}
            </TextBold>
          </>
        </div>
      </Card>
      <Card className="">
        <TextBold>Phí vận chuyển</TextBold>
        <div className="text-2xl italic">
          Đối với những đơn hàng có sự dụng dịch vụ vận chuyển
        </div>
        <div className="grid grid-cols-2 mt-4 gap-2">
          {data?.map((d) => (
            <>
              <div>Từ {d.fromDistance}km:</div>
              <TextBold className="text-end">
                {formatCurrency(d.price)}
              </TextBold>
            </>
          ))}
        </div>
      </Card>
      <Button type={"primary"} small onClick={onNext} wrapperClassName="mt-4">
        Xác nhận và tiếp tục
      </Button>
    </div>
  );
}

export default SendInformation;
