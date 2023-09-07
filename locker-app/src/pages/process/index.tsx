import BackButton from "@/components/core/BackButton";
import ProcessCode from "@/components/process/ProcessCode";
import ProcessSuccess from "@/components/process/ProcessSuccess";
import { PATH } from "@/constants/common";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReceivePage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    store.dispatch(
      setGlobalState({
        keyboard: undefined,
      })
    );
  }, [step]);

  return (
    <div className="p-10 h-full flex flex-col items-center gap-8">
      {(() => {
        switch (step) {
          case 1:
            return <ProcessCode onNext={() => setStep(2)} />;
          case 2:
            return <ProcessSuccess onNext={() => navigate(PATH.DASHBOARD)} />;
        }
      })()}
    </div>
  );
}

export default ReceivePage;
