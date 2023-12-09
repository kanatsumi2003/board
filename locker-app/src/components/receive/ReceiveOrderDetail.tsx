import Button from "@/components/core/Button";
import useModal from "@/hooks/useModal";
import { IDetailItem, ORDER_TYPE } from "@/interfaces/order";
import { useCheckOutOrderMutation } from "@/services/orderService";
import { AppState } from "@/stores";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { renderOrderTypeText } from "@/utils/orderTypeRender";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Title from "../Title";
import Asterisk from "../core/Asterisk";
import BackStepButton from "../core/BackStepButton";
import { Card } from "../core/Card";
import { Draggable } from "../core/Draggable";
import TextBold from "../core/TextBold";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function ReceiveOrderDetail({ onNext, onPrev }: Props) {
  const { order } = useSelector((state: AppState) => state.order);
  const { orderSettings } = useSelector((state: AppState) => state.setting);
  const [checkOut, { isSuccess, data, isError, error }] =
    useCheckOutOrderMutation();

  const modal = useModal();
  if (!order) {
    return <></>;
  }

  const handleCheckOut = () => {
    modal.confirm({
      message:
        "Hệ thống sẽ tự động trừ tiền hoặc hoàn tiền vào số dư của bạn. Bạn có chắc chắn chứ?",
      onOk: () => {
        checkOut({ id: order?.id });
      },
      onClose: () => {},
    });
  };

  useEffect(() => {
    if (isSuccess && data) {
      onNext();
      return;
    }
    if (isError) {
      modal.error({ message: error?.message?.message });
    }
  }, [isSuccess, isError]);

  return (
    <>
      <Title subtitle="Nhận hàng">Xác nhận thông tin đơn hàng</Title>
      <div className="mt-44 flex w-full items-center flex-col h-full justify-between px-12">
        <div className="w-full">
          <div className="text-center">
            <div className="font-light">Số tiền cần thanh toán</div>
            <div className="text-7xl font-bold mt-4">
              {formatCurrency(
                order.totalPrice - order.reservationFee > 0
                  ? order.totalPrice - order.reservationFee
                  : 0
              )}
            </div>
          </div>
          <div className="flex flex-col gap-8 w-full justify-center mt-8">
            <Card className="grid grid-cols-2 gap-y-3 gap-x-1 basis-3/5 justify-center">
              <div className="font-semibold col-span-2 mb-4 text-4xl">
                Thông tin đơn hàng:
              </div>
              <div>Mã đơn hàng:</div>
              <div className="font-bold text-end">{order.id}</div>
              <div>Mã PIN đơn hàng:</div>
              <div className="font-bold text-end">{order.pinCode}</div>
              <div>Loại dịch vụ:</div>
              <div className="font-bold text-end">
                {renderOrderTypeText(order.type)}
              </div>
              <div>SĐT người gửi:</div>
              <div className="font-bold text-end">
                {order.sender.phoneNumber}
              </div>
              {order.receiver?.phoneNumber && (
                <>
                  <div>SĐT người nhận:</div>
                  <div className="font-bold text-end">
                    {order.receiver?.phoneNumber}
                  </div>
                </>
              )}
              {order.createdAt && (
                <>
                  <div>Thời gian tạo đơn hàng:</div>
                  <div className="font-bold text-end">
                    {formatDate(order.createdAt)}
                  </div>
                </>
              )}

              {/* <div className="w-full border-b border-solid col-span-2 border-black"></div> */}
              {order.type === ORDER_TYPE.LAUNDRY && (
                <>
                  <div className="font-semibold col-span-2 my-4 text-4xl">
                    Chi tiết hóa đơn:
                  </div>
                  <div>Phí dịch vụ:</div>
                  <div className="font-bold text-end">
                    {formatCurrency(order.price ?? 0)}
                  </div>
                  {/* <div>Giảm giá:</div>
                  <div className="font-bold text-end">
                    - {formatCurrency(order.discount ?? 0)}
                  </div> */}
                  <div>Trả trước:</div>
                  <div className="font-bold text-end">
                    {formatCurrency(order.reservationFee ?? 0)}
                  </div>
                  {order.reservationFee > order.totalPrice && (
                    <>
                      <div>Hoàn trả:</div>
                      <div className="font-bold text-end">
                        {formatCurrency(
                          order.reservationFee - order.totalPrice ?? 0
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
              {order.type === ORDER_TYPE.STORAGE && (
                <>
                  <div className="font-semibold col-span-2 my-4 text-4xl">
                    Chi tiết hóa đơn:
                  </div>
                  <>
                    <div>Tổng tiền:</div>
                    <div className="font-bold text-end">
                      {formatCurrency(order.totalPrice ?? 0)}
                    </div>
                  </>{" "}
                  <div>Trả trước:</div>
                  <div className="font-bold text-end">
                    {formatCurrency(order.reservationFee ?? 0)}
                  </div>
                  {order.reservationFee > order.totalPrice && (
                    <>
                      <div>Hoàn trả:</div>
                      <div className="font-bold text-end">
                        {formatCurrency(
                          order.reservationFee - order.totalPrice ?? 0
                        )}
                      </div>
                    </>
                  )}
                </>
              )}
            </Card>
            {order.type === ORDER_TYPE.LAUNDRY && (
              <>
                <Card>
                  <div className="font-semibold mb-8 text-4xl">
                    {`Chi tiết đơn hàng (${order.details.length} dịch vụ):`}
                  </div>
                  <Draggable>
                    <div className="flex flex-col overflow-y-scroll h-[240px] gap-2 w-full">
                      {order.details.map((detail: IDetailItem) => (
                        <div
                          className={`flex p-2 bg-gray-100 rounded-lg w-full items-center md:h-52 gap-8`}
                          key={detail.id}
                        >
                          <div className="h-full md:w-60 md:h-40 xl:w-32 xl:h-20">
                            <img
                              src={detail.service.image}
                              alt=""
                              className="h-full w-full object-cover rounded-lg"
                            />
                          </div>
                          <div className="flex flex-col justify-center gap-1 text-ellipsis xl:w-full">
                            <div className="font-bold text-4xl overflow-hidden text-ellipsis whitespace-nowrap">
                              {detail.service.name}
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
                                    {`${detail.quantity} ${detail.service.unit}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Draggable>
                </Card>
                {/* <div className="bg-white shadow-xl grid grid-cols-2 p-12 rounded-3xl gap-y-3 gap-x-1 basis-3/5 justify-center">
                  <div className="font-semibold col-span-2 mb-4 text-4xl">
                    Chi tiết hóa đơn:
                  </div>
                  <div>Thành tiền:</div>
                  <div className="font-bold text-end">
                    {formatCurrency(order.price ?? 0)}
                  </div>
                  <div>Phụ thu:</div>
                  <div className="font-bold text-end">
                    {`${formatCurrency(order.extraFee ?? 0)}`}{" "}
                    {order.extraFee ? (
                      <span className="font-normal">{`(${formatCurrency(
                        order.extraCount ?? 0
                      )} giờ)`}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div> */}
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {/* <div>
            <Asterisk /> Số tiền trên chỉ bao gồm phí dịch vụ (chưa bao gồm số
            tiền trả trước{" "}
            <TextBold>
              {formatCurrency(orderSettings?.reservationFee ?? 0)}
            </TextBold>
            ).
          </div> */}
          <div>
            <Asterisk /> Sau khi ấn xác nhận, hệ thống sẽ tự động kiểm tra và{" "}
            <TextBold>tự động thanh toán</TextBold>, đồng thời cũng hoàn trả lại{" "}
            <TextBold>tiền trả trước</TextBold> vào số dư ví của bạn.
          </div>
          <Button
            type="primary"
            small
            onClick={handleCheckOut}
            className="mt-4"
          >
            Xác nhận thanh toán
          </Button>
          <BackStepButton onClick={onPrev} />
        </div>
      </div>
    </>
  );
}

export default ReceiveOrderDetail;
