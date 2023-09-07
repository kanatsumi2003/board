import BackButton from "@/components/core/BackButton";
import ReturnCode from "@/components/return/ReturnCode";
import ReturnSuccess from "@/components/return/ReturnSuccess";
import { PATH } from "@/constants/common";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReceivePage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  return (
    <div className="p-10 h-full flex flex-col items-center gap-8">
      {(() => {
        switch (step) {
          case 1:
            return <ReturnCode onNext={() => setStep(2)} />;
          case 2:
            return <ReturnSuccess onNext={() => navigate(PATH.DASHBOARD)} />;
        }
      })()}
    </div>
  );
}

export default ReceivePage;
