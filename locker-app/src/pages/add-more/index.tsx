import AddMoreCode from "@/components/add-more/AddMoreCode";
import AddMoreSuccess from "@/components/add-more/AddMoreSuccess";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AddMorePage() {
  const [step, setStep] = useState(1);
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
            return <AddMoreCode onNext={() => setStep(2)} />;
          case 2:
            return <AddMoreSuccess onNext={() => navigate(PATH.HOME)} />;
        }
      })()}
    </div>
  );
}

export default AddMorePage;
