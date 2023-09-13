import useModal from "@/hooks/useModal";
import { useEffect, useState } from "react";
import SendPhoneNumber from "./SendPhoneNumber";
import SendReceiveTime from "./SendReceiveTime";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendCreateOrder({ onNext, onPrev }: Props) {
  const modal = useModal();
  const [step, setStep] = useState(1);

  useEffect(() => {}, []);

  return (
    <>
      {(() => {
        switch (step) {
          case 1: {
            return (
              <SendPhoneNumber onNext={() => setStep(2)} onPrev={onPrev} />
            );
          }
          case 2: {
            return (
              <SendReceiveTime onNext={() => setStep(3)} onPrev={onPrev} />
            );
          }
        }
      })()}
    </>
  );
}
export default SendCreateOrder;
