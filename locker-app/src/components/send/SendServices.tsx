import ServiceContainer from "@/containers/ServicesContainer";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";

interface Props {
  onNext: () => void;
  clearType: () => void;
  onBack: () => void;
}

function SendServices({ onNext, clearType, onBack }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [serviceIds, setServiceIds] = useState<number[]>(
    orderRequest?.serviceIds ?? []
  );

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
      <div className="px-16">
        <Button
          type={serviceIds.length ? "primary" : "disabled"}
          className="mt-4"
          small
          onClick={onHandleChoose}
        >
          Tiếp theo
        </Button>
      </div>
      <ServiceContainer
        serviceIds={serviceIds}
        setServiceIds={setServiceIds}
        onBack={onBack}
      />
    </>
  );
}

export default SendServices;
