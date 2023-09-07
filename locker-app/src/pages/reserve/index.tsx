import ReserveCode from "@/components/reserve/ReserveCode";
import ReserveSuccess from "@/components/reserve/ReserveSuccess";
import { PATH } from "@/constants/common";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReservePage() {
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
    <div className="p-10 h-full flex flex-col items-center gap-8">
      {(() => {
        switch (step) {
          case 1:
            return <ReserveCode onNext={() => setStep(2)} />;
          case 2:
            return <ReserveSuccess onNext={() => navigate(PATH.HOME)} />;
        }
      })()}
    </div>
  );
}

export default ReservePage;
