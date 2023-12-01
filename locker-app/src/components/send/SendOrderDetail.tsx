import Button from "@/components/core/Button";
import useKeyboard from "@/hooks/useKeyboard";
import { IOrderServiceItem, ORDER_TYPE } from "@/interfaces/order";
import { AppState } from "@/stores";
import { formatCurrency } from "@/utils/formatter";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import { Card } from "../core/Card";
import { Draggable } from "../core/Draggable";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendOrderDetail({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const { close } = useKeyboard();
  useEffect(() => close(), []);

  if (!orderRequest) {
    return <></>;
  }

  return (
    <>
      <div className="mt-12 flex w-full items-center flex-col h-full justify-between px-12">
        <div className="w-full">
          <div className="text-center">
            <div className="font-light">Tổng giá tiền ước tính</div>
            <div className="text-7xl font-bold mt-4">
              {formatCurrency(
                orderRequest.details?.reduce(
                  (prev, current) => prev + current.price,
                  0
                ) ?? 0
              )}
            </div>
          </div>
          <div className="flex flex-col gap-12 w-full justify-center mt-12">
            <Card className="grid grid-cols-2 gap-y-3 gap-x-1 basis-3/5 justify-center">
              <div className="font-semibold col-span-2 mb-4 text-4xl">
                Thông tin đơn hàng:
              </div>
              <div>Loại dịch vụ:</div>
              <div className="font-bold text-end">{orderRequest.type}</div>
              <div>SĐT người gửi:</div>
              <div className="font-bold text-end">
                {orderRequest.senderPhone}
              </div>
              {orderRequest.receiverPhone && (
                <>
                  <div>SĐT người nhận:</div>
                  <div className="font-bold text-end">
                    {orderRequest.receiverPhone}
                  </div>
                </>
              )}
            </Card>
            {orderRequest.type === ORDER_TYPE.LAUNDRY &&
              orderRequest.details && (
                <>
                  <Card>
                    <div className="font-semibold mb-8 text-4xl">
                      {`Dịch vụ đã chọn (${orderRequest.details?.length} dịch vụ):`}
                    </div>
                    <Draggable>
                      <div className="flex flex-col overflow-y-scroll h-[280px] gap-2 w-full">
                        {orderRequest.details?.map(
                          (detail: IOrderServiceItem) => (
                            <div
                              className={`flex p-2 bg-gray-100 rounded-lg w-full items-center md:h-52 gap-8`}
                              key={detail.id}
                            >
                              <div className="h-full md:w-60 md:h-40 xl:w-32 xl:h-20">
                                <img
                                  src={detail.image}
                                  alt=""
                                  className="h-full w-full object-cover rounded-lg"
                                />
                              </div>
                              <div className="flex flex-col justify-center gap-1 text-ellipsis xl:w-full">
                                <div className="font-bold text-4xl overflow-hidden text-ellipsis whitespace-nowrap">
                                  {detail.name}
                                </div>
                                <div className="mt-2">
                                  <div>
                                    Đơn giá:{" "}
                                    <span className="font-semibold">
                                      {formatCurrency(detail.price ?? 0)}
                                    </span>{" "}
                                  </div>
                                  {detail.quantity && (
                                    <div>
                                      Số lượng:{" "}
                                      <span className="font-semibold">
                                        {`${detail.quantity} ${detail.unit}`}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </Draggable>
                  </Card>
                </>
              )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button type="primary" small onClick={onNext}>
            Xác nhận và tiếp tục
          </Button>
          <BackStepButton onClick={onPrev} />
        </div>
      </div>
    </>
  );
}

export default SendOrderDetail;
