import BackButton from "@/components/core/BackButton";
import ReceiveChooseMethod from "@/components/receive/ReceiveChooseMethod";
import ReceiveCode from "@/components/receive/ReceiveCode";
import ReceiveOrderDetail from "@/components/receive/ReceiveOrderDetail";
import ReceivePayment from "@/components/receive/ReceivePayment";
import ReceiveSuccess from "@/components/receive/ReceiveSuccess";
import { PATH } from "@/constants/common";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReceivePage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (step !== 1) {
      store.dispatch(
        setGlobalState({
          keyboard: undefined,
        })
      );
    }
  }, [step]);

  return (
    <div className="p-10 h-full flex flex-col items-center gap-6 justify-between">
      {(() => {
        switch (step) {
          case 1:
            return <ReceiveCode onNext={() => setStep(2)} />;
          case 2:
            return (
              <ReceiveOrderDetail
                onNext={() => setStep(3)}
                onPrev={() => setStep(1)}
              />
            );
          case 3:
            return (
              <ReceiveChooseMethod
                onNext={() => setStep(4)}
                onPrev={() => setStep(1)}
              />
            );
          case 4:
            return <ReceivePayment onNext={() => setStep(5)} />;
          case 5:
            return <ReceiveSuccess onNext={() => navigate(PATH.HOME)} />;
        }
      })()}
    </div>
  );
}

export default ReceivePage;
