import ServiceContainer from "@/containers/ServicesContainer";
import { IOrderServiceItem } from "@/interfaces/order";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { useState } from "react";
import { useSelector } from "react-redux";
import Button from "../core/Button";
import { Card } from "../core/Card";
import { formatCurrency } from "@/utils/formatter";
import Asterisk from "../core/Asterisk";
import TextBold from "../core/TextBold";

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
            <TextBold>{`(${selectedServices.length} dịch vụ)`}</TextBold>
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
          <Asterisk /> Tổng phí dịch vụ trên chỉ là
          <TextBold> ước tính</TextBold> và
          <TextBold> chưa bao gồm phí vận chuyển</TextBold> (nếu có), giá trị
          thực tế <TextBold>có thể sẽ thay đổi </TextBold>
          bởi nhân viên.
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
