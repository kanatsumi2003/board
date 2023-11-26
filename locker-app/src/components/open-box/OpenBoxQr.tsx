import useCountDown from "@/hooks/useCountdown";
import useModal from "@/hooks/useModal";
import { useBoxTokenMutation } from "@/services/boxService";
import { AppState } from "@/stores";
import dayjs from "dayjs";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import Title from "../Title";
import { Card } from "../core/Card";
import { useNavigate } from "react-router-dom";
import { formatTime } from "@/utils/utils";

interface Props {}

function OpenBoxQr({}: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [mutate, { data, isSuccess }] = useBoxTokenMutation();
  const { countDown, setCountDown } = useCountDown(0);
  const modal = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    mutate({
      id: Number(locker?.id),
    });
  }, []);

  useEffect(() => {
    if (isSuccess && data) {
      setCountDown(
        (dayjs(data?.expiredAt).valueOf() - dayjs().valueOf()) / 1000
      );
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccess && !countDown) {
      modal.error({
        message: "Mã mở tủ đã hết hiệu lực",
        onClose: () => navigate(-1),
      });
    }
  }, [countDown]);

  return (
    <>
      <Title subtitle="Mở tủ khẩn cấp">Vui lòng quét mã QR để mở tủ</Title>
      <div className="mt-52 flex w-full items-center flex-col gap-24 h-full">
        <div className="flex w-full items-center flex-col gap-8">
          <Card className="gap-4 flex flex-col items-center mt-12">
            {data?.value && <QRCode value={data?.value} size={440} />}
            <div className="text-center">
              <div className="font-light mt-4">
                {countDown
                  ? `Mã sẽ hết hiệu lực sau: ${formatTime(countDown)}`
                  : "Mã đã hết hiệu lực"}
              </div>

              {/* {countDown === 0 && <>Mã đã hết hạn</>} */}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default OpenBoxQr;
