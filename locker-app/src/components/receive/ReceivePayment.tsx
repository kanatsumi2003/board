import QRImage from "@/assets/qr.jpg";
import useModal from "@/hooks/useModal";
import { useBillQuery } from "@/services/orderService";
import { AppState } from "@/stores";
import { formatCurrency } from "@/utils/formatter";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import { Card } from "../core/Card";

interface Props {
  onNext: () => void;
}

function ReceivePayment({ onNext }: Props) {
  const { bill, order } = useSelector((state: AppState) => state.order);
  const { data } = useBillQuery(
    { orderId: Number(order?.id) },
    {
      pollingInterval: 2000,
      skip: !order?.id,
    }
  );
  const modal = useModal();

  useEffect(() => {
    if (data) {
      modal.success({
        message: "Thanh toán thành công",
        onClose: onNext,
      });
    }
  }, [data]);

  if (!order) {
    return <></>;
  }
  return (
    <>
      <Title subtitle="Nhận hàng">Vui lòng quét mã QR sau để thanh toán</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full px-12 justify-between">
        <div className="w-full">
          <div className="text-center w-full">
            <div className="font-light mt-2">Số tiền cần thanh toán</div>
            <div className="text-7xl font-bold mt-4">
              {formatCurrency(order.price + (order.extraFee ?? 0))}
            </div>
          </div>
          <Card className="gap-4 flex flex-col items-center mt-12">
            <img src={QRImage} alt="qr_Image" className="max-h-80" />
            <div className="text-center">
              <div className="font-light mt-4">Nội dung chuyển khoản</div>
              <div className="font-bold mt-4">{bill?.content}</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default ReceivePayment;
