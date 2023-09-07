import Stepper from "@/components/core/Stepper";
import SendChooseService from "@/components/send/SendChooseService";
import SendCreateOrder from "@/components/send/SendCreateOrder";
import SendSuccess from "@/components/send/SendSuccess";
import { PATH } from "@/constants/common";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useState } from "react";
import { AiOutlineFileDone, AiOutlineForm } from "react-icons/ai";
import { RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

function SendPage() {
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
    <div className="p-10 h-full flex flex-col item-center">
      <Stepper
        current={step}
        steps={[
          {
            icon: <RxDashboard />,
            onClick: () => setStep(1),
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
            return <SendChooseService onNext={() => setStep(2)} />;
          case 2:
            return (
              <SendCreateOrder
                onNext={() => setStep(3)}
                onPrev={() => setStep(1)}
              />
            );
          case 3:
            return <SendSuccess onNext={() => navigate(PATH.HOME)} />;
        }
      })()}
    </div>
  );
}

export default SendPage;
