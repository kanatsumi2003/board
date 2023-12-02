import { PATH, PAYMENT_POLLING_INTERVAL } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { ORDER_PAYMENT_STATUS } from "@/interfaces/order";
import { usePaymentQuery } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { formatCurrency } from "@/utils/formatter";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Title from "../Title";
import { Card } from "../core/Card";

interface Props {
  onNext: () => void;
  amount?: number;
}

function LookUpPayment({ onNext, amount }: Props) {
  const { payment } = useSelector((state: AppState) => state.order);
  const { data } = usePaymentQuery(
    { paymentId: Number(payment?.id) },
    {
      pollingInterval: PAYMENT_POLLING_INTERVAL,
      skip: !amount || !payment?.id,
    }
  );
  const modal = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    store.dispatch(
      setGlobalState({
        disableCountDown: true,
      })
    );
    return () => {
      store.dispatch(
        setGlobalState({
          disableCountDown: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    if (data && data.status === ORDER_PAYMENT_STATUS.COMPLETED) {
      modal.success({
        message: "Thanh toán thành công",
        onClose: onNext,
      });
      return;
    }
    if (data && data?.status === ORDER_PAYMENT_STATUS.FAILED) {
      modal.error({
        message: "Thanh toán thất bại",
        onClose: () => {
          navigate(PATH.HOME);
        },
      });
    }
  }, [data]);

  if (!amount) {
    return <></>;
  }

  return (
    <>
      <Title subtitle="Tra cứu">Vui lòng quét mã QR để nạp tiền</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full px-12 justify-between">
        <div className="w-full">
          <div className="text-center w-full">
            <div className="font-light mt-2">Số tiền cần thanh toán</div>
            <div className="text-7xl font-bold mt-4">
              {formatCurrency(amount)}
            </div>
          </div>
          <Card className="gap-4 flex flex-col items-center mt-12">
            {payment?.qr && <QRCode value={payment?.qr} size={440} />}
            <div className="text-center">
              <div className="font-light mt-4">Nội dung chuyển khoản</div>
              <div className="font-bold mt-4 text-4xl">{payment?.content}</div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default LookUpPayment;
