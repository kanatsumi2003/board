import QRImage from "@/assets/qr.jpg";
import useModal from "@/hooks/useModal";
import { useBillQuery } from "@/services/orderService";
import { AppState } from "@/stores";
import { formatCurrency } from "@/utils/formatter";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function ReceivePayment({ onNext }: { onNext: () => void }) {
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
      <div className="flex flex-col items-center gap-2">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-60 rounded-b-[80px] -z-10`}
        ></div>
        <div className="text-3xl font-bold mt-4 text-white">
          Vui lòng quét mã QR sau để thanh toán
        </div>
        <div className="font-light mt-2 text-white">Số tiền thanh toán</div>
        <div className="text-5xl font-bold text-white">
          {formatCurrency(order.price + (order.extraFee ?? 0))}
        </div>
      </div>
      <div className="bg-white shadow-2xl rounded-3xl gap-4 p-10 flex flex-col items-center">
        <img src={QRImage} alt="qr_Image" className="max-h-60" />
        <div className="text-center">
          <div className="font-light mt-2">Nội dung chuyển khoản</div>
          <div className="font-bold text-xl">{bill?.content}</div>
        </div>
      </div>
    </>
  );
}

export default ReceivePayment;
