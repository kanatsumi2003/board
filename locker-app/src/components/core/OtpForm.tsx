import { useEffect, useState } from "react";
import Button from "./Button";
import Otp from "./Otp";

interface Props {
  onSubmit: (otp: string) => void;
}

function OtpForm({ onSubmit }: Props) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>();

  useEffect(() => {
    setOtp("");
  }, []);

  useEffect(() => {
    setError(undefined);
  }, [otp]);

  return (
    <>
      <div>
        <Otp otp={otp} setOtp={setOtp} />
        <div className="col-span-2 text-locker-red font-semibold float-left mt-4">
          {error}
        </div>
      </div>
      <Button
        type="primary"
        small
        onClick={() => {
          if (otp.length === 0) {
            setError("Vui lòng nhập OTP");
          } else if (otp?.length !== 6) {
            setError("Mã OTP không hợp lệ");
          } else {
            setError(undefined);
            onSubmit(otp);
          }
        }}
      >
        Xác nhận
      </Button>
    </>
  );
}

export default OtpForm;
