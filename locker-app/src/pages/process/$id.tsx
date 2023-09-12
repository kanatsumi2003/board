import ProcessOrderDetail from "@/components/process/ProcessOrderDetail";
import ProcessSuccess from "@/components/process/ProcessSuccess";
import { PATH } from "@/constants/common";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProcessDetailPage() {
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
    <div className="p-10 h-full flex flex-col items-center gap-8 justify-between">
      {(() => {
        switch (step) {
          case 1:
            return <ProcessOrderDetail onNext={() => setStep(2)} />;
          case 2:
            return <ProcessSuccess onNext={() => navigate(PATH.DASHBOARD)} />;
        }
      })()}
    </div>
  );
}

export default ProcessDetailPage;
