import ReturnOrderDetail from "@/components/return/ReturnOrderDetail";
import ReturnSuccess from "@/components/return/ReturnSuccess";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ReturnDetailPage() {
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
            return <ReturnOrderDetail onNext={() => setStep(2)} />;
          case 2:
            return <ReturnSuccess onNext={() => navigate(PATH.DASHBOARD)} />;
        }
      })()}
    </div>
  );
}

export default ReturnDetailPage;
