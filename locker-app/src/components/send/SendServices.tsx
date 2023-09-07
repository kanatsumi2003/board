import ServiceContainer from "@/containers/ServicesContainer";
import store from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useState } from "react";
import BackButton from "../core/BackButton";
import Button from "../core/Button";

function SendServices({
  onNext,
  clearType,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
  clearType: () => void;
}) {
  const [serviceIds, setServiceIds] = useState<number[]>([]);

  const onHandleChoose = () => {
    store.dispatch(
      setOrderRequest({
        serviceIds: serviceIds,
      })
    );
    onNext();
  };

  return (
    <>
      <div className="px-12">
        <Button type="primary" className="mt-4" small onClick={onHandleChoose}>
          Tiếp theo
        </Button>
      </div>
      <ServiceContainer
        serviceIds={serviceIds}
        setServiceIds={setServiceIds}
        onBack={onBack}
      />

      <BackButton onClick={clearType} />
    </>
  );
}

export default SendServices;
