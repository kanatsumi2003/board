import ProcessOrderDetail from "@/components/process/ProcessOrderDetail";
import ProcessSuccess from "@/components/process/ProcessSuccess";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ProcessDetailPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { close } = useKeyboard();

  useEffect(() => {
    close();
  }, [step]);

  return (
    <div className="p-10 h-full flex flex-col items-center gap-8 justify-between">
      {(() => {
        switch (step) {
          case 1:
            return <ProcessOrderDetail onNext={() => setStep(2)} />;
          case 2:
            return <ProcessSuccess onNext={() => navigate(PATH.BOXES)} />;
        }
      })()}
    </div>
  );
}

export default ProcessDetailPage;
