import Stepper from "@/components/core/Stepper";
import SendChooseService from "@/components/send/SendChooseService";
import SendCreateOrder from "@/components/send/SendCreateOrder";
import SendInformation from "@/components/send/SendInformation";
import SendSuccess from "@/components/send/SendSuccess";
import { PATH } from "@/constants/common";
import useKeyboard from "@/hooks/useKeyboard";
import { useEffect, useState } from "react";
import { AiOutlineFileDone, AiOutlineForm } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

function SendPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { close } = useKeyboard();

  useEffect(() => {
    close();
  }, [step]);

  return (
    <div className="p-10 h-full flex flex-col item-center gap-4">
      <Stepper
        current={step - 1}
        steps={[
          {
            icon: <RxDashboard />,
            onClick: () => setStep(2),
            title: "Chọn dịch vụ",
          },
          {
            icon: <AiOutlineForm />,
            title: "Thông tin đơn hàng",
          },
          {
            icon: <AiOutlineFileDone />,
            title: "Hoàn tất",
          },
        ]}
      />
      {(() => {
        switch (step) {
          case 1:
            return <SendInformation onNext={() => setStep(2)} />;
          case 2:
            return <SendChooseService onNext={() => setStep(3)} />;
          case 3:
            return (
              <SendCreateOrder
                onNext={() => setStep(4)}
                onPrev={() => setStep(2)}
              />
            );
          case 4:
            return <SendSuccess onNext={() => navigate(PATH.HOME)} />;
        }
      })()}
    </div>
  );
}

export default SendPage;
