import useModal from "@/hooks/useModal";
import { ORDER_TYPE } from "@/interfaces/order";
import { useCreateOrderMutation } from "@/services/orderService";
import store, { AppState } from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendAddress from "./SendAddress";
import SendNote from "./SendNote";
import SendPhoneNumber from "./SendPhoneNumber";
import SendReceiveTime from "./SendReceiveTime";
import SendOrderDetail from "./SendOrderDetail";

interface CreateOrderFormError {
  senderPhone?: string;
  receiverPhone?: string;
}

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendCreateOrder({ onNext, onPrev }: Props) {
  const modal = useModal();
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const { locker } = useSelector((state: AppState) => state.locker);
  const [step, setStep] = useState(1);
  const [
    createOrder,
    {
      isSuccess: createOrderIsSuccess,
      isError: createOrderIsError,
      data: createOrderData,
      error: createOrderError,
    },
  ] = useCreateOrderMutation();

  const onSubmitCreateOrder = () => {
    createOrder({
      ...orderRequest,
      lockerId: Number(locker?.id),
      deliveryAddress:
        orderRequest?.deliveryAddress?.address &&
        orderRequest?.deliveryAddress?.wardCode &&
        orderRequest?.deliveryAddress?.districtCode &&
        orderRequest?.deliveryAddress?.provinceCode
          ? orderRequest.deliveryAddress
          : undefined,
    });
  };

  useEffect(() => {
    if (createOrderIsSuccess) {
      store.dispatch(
        setOrderState({
          order: createOrderData,
        })
      );
      onNext();
      return;
    }
    if (createOrderIsError && createOrderError) {
      modal.error({ message: createOrderError?.message?.message });
    }
  }, [createOrderIsSuccess, createOrderIsError]);

  return (
    <>
      {(() => {
        switch (step) {
          case 1: {
            return (
              <SendPhoneNumber
                onNext={() =>
                  orderRequest?.type === ORDER_TYPE.LAUNDRY
                    ? setStep(2)
                    : onSubmitCreateOrder()
                }
                onPrev={onPrev}
              />
            );
          }
          case 2: {
            return (
              <SendReceiveTime
                onNext={() => setStep(3)}
                onPrev={() => setStep(1)}
              />
            );
          }
          case 3: {
            return (
              <SendAddress
                onNext={() => setStep(4)}
                onPrev={() => setStep(2)}
              />
            );
          }
          case 4: {
            return (
              <SendNote
                onNext={() => {
                  setStep(5);
                }}
                onPrev={() => setStep(3)}
              />
            );
          }
          case 5: {
            return (
              <SendOrderDetail
                onNext={onSubmitCreateOrder}
                onPrev={() => setStep(4)}
              />
            );
          }
        }
      })()}
    </>
  );
}
export default SendCreateOrder;
