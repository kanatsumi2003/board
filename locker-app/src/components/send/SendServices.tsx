import ServiceContainer from "@/containers/ServicesContainer";
import { IOrderServiceItem } from "@/interfaces/order";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import { Card } from "../core/Card";
import { formatCurrency } from "@/utils/formatter";

interface Props {
  onNext: () => void;
  clearType: () => void;
  onBack: () => void;
}

function SendServices({ onNext, clearType, onBack }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [services, setServices] = useState<IOrderServiceItem[]>(
    orderRequest?.details ?? []
  );
  const selectedServices = services.filter((s) => s.quantity > 0);

  const onHandleChoose = () => {
    store.dispatch(
      setOrderRequest({
        details: selectedServices,
      })
    );
    onNext();
  };

  return (
    <>
      <div className="px-16">
        <Card className="grid grid-cols-6 mt-8 py-4 items-end">
          <div className="col-span-4">
            Tổng phí dịch vụ:{" "}
            <span className="font-bold">
              ({selectedServices.length} dịch vụ)
            </span>
          </div>
          <div className="font-bold text-5xl text-right col-span-2">
            {formatCurrency(
              selectedServices.reduce(
                (previous, current) =>
                  previous + Number(current.price) * current.quantity,
                0
              ) ?? 0
            )}
          </div>

          <Button
            type={selectedServices.length ? "primary" : "disabled"}
            small
            onClick={onHandleChoose}
            wrapperClassName="col-span-6 mt-8"
          >
            Tiếp theo
          </Button>
        </Card>
        <div className="col-span-4 mt-4">
          <span className="text-red-600 text-4xl font-bold">*</span> Tổng phí
          dịch vụ trên chỉ là
          <span className="font-bold"> ước tính</span>, giá trị thực tế{" "}
          <span className="font-bold">có thể sẽ thay đổi </span>bởi nhân viên.
        </div>
      </div>
      <ServiceContainer
        onChange={(selectedServices: IOrderServiceItem[]) =>
          setServices(selectedServices)
        }
        onBack={onBack}
      />
    </>
  );
}

export default SendServices;
