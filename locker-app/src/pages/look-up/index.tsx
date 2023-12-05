import LookUpChooseMethod from "@/components/look-up/LookUpChooseMethod";
import LookUpDetail from "@/components/look-up/LookUpDetail";
import LookUpPayment from "@/components/look-up/LookUpPayment";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMorePage() {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState<string>();
  const [amount, setAmount] = useState<number>();
  const navigate = useNavigate();
  const { close } = useKeyboard();

  useEffect(() => {
    if (step !== 1) {
      close();
    }
  }, [step]);

  return (
    <div className="p-10 h-full flex flex-col items-center gap-8">
      {(() => {
        switch (step) {
          case 1:
            return (
              <LookUpDetail
                onNext={(phoneNumber) => {
                  setStep(2);
                  setPhoneNumber(phoneNumber);
                }}
              />
            );
          case 2:
            return (
              <LookUpChooseMethod
                phoneNumber={phoneNumber}
                onNext={(amount) => {
                  setStep(3);
                  setAmount(amount);
                }}
              />
            );
          case 3:
            return <LookUpPayment amount={amount} onNext={() => setStep(1)} />;
        }
      })()}
    </div>
  );
}

export default AddMorePage;
