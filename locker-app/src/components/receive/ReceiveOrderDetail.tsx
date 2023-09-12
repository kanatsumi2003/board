import Button from "@/components/core/Button";
import { IDetailItem, ORDER_TYPE } from "@/interfaces/order";
import { AppState } from "@/stores";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import { Draggable } from "../core/Draggable";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function ReceiveOrderDetail({ onNext, onPrev }: Props) {
  const { order } = useSelector((state: AppState) => state.order);

  if (!order) {
    return <></>;
  }

  return (
    <>
      <div className="flex flex-col items-center gap-2">
        <div
          className={`absolute top-0 left-0 right-0 bg-locker-blue h-60 rounded-b-[80px] -z-10`}
        ></div>
        <div className="text-3xl font-bold mt-4 text-white">
          Xác nhận thông tin đơn hàng
        </div>
        <div className="font-light mt-2 text-white">Số tiền thanh toán</div>
        <div className="text-5xl font-bold text-white">
          {formatCurrency(order.price + (order.extraFee ?? 0))}
        </div>
      </div>
      <div className="flex gap-4 w-full px-12 justify-center">
        <div className="bg-white shadow-2xl grid grid-cols-2 p-8 rounded-3xl gap-y-3 gap-x-1 basis-3/5 justify-center">
          <div className="font-semibold col-span-2">Thông tin đơn hàng:</div>
          <div>Mã đơn hàng:</div>
          <div className="font-bold">{order.id}</div>
          <div>Mã PIN đơn hàng:</div>
          <div className="font-bold">{order.pinCode}</div>
          <div>Loại dịch vụ:</div>
          <div className="font-bold">{order.type}</div>
          <div>SĐT người gửi:</div>
          <div className="font-bold">{order.sender.phoneNumber}</div>
          {order.receiver?.phoneNumber && (
            <>
              <div>SĐT người nhận:</div>
              <div className="font-bold">{order.receiver?.phoneNumber}</div>
            </>
          )}
          {order.createdAt && (
            <>
              <div>Thời gian:</div>
              <div className="font-bold">{formatDate(order.createdAt)}</div>
            </>
          )}
        </div>
        {order.type === ORDER_TYPE.LAUNDRY && (
          <div className="flex flex-col gap-2 basis-2/5">
            <div className="bg-white shadow-2xl p-5 rounded-3xl gap-2">
              <div className="font-semibold mb-2">Chi tiết đơn hàng:</div>
              <Draggable>
                <div className="flex flex-col overflow-y-scroll h-[140px] gap-2 w-full">
                  {order.details.map((detail: IDetailItem) => (
                    <div
                      className={`flex p-2 bg-gray-100 rounded-lg w-full items-center`}
                      key={detail.id}
                    >
                      <img
                        src={detail.service.image}
                        alt=""
                        className="w-32 h-14 object-cover rounded-lg"
                      />
                      <div className="flex flex-col justify-center gap-1 ml-2 text-ellipsis w-full">
                        <div className="font-bold text-base overflow-hidden text-ellipsis whitespace-nowrap">
                          {detail.service.name}
                        </div>
                        <div>
                          <div className="text-xs">
                            Đơn giá:{" "}
                            <span className="font-semibold">
                              {formatCurrency(detail.price ?? 0)}
                            </span>{" "}
                          </div>
                          <div className="text-xs">
                            Số lượng:{" "}
                            <span className="font-semibold">
                              {`${detail.quantity} ${detail.service.unit}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Draggable>
            </div>
            <div className="bg-white shadow-2xl p-5 rounded-3xl gap-2 grid grid-cols-2 justify-items-end">
              <div>Thành tiền:</div>
              <div className="font-bold">
                {formatCurrency(order.price ?? 0)}
              </div>
              <div>Phụ thu:</div>
              <div className="font-bold">
                {`${formatCurrency(order.extraFee ?? 0)}`}{" "}
                {order.extraFee ? (
                  <span className="text-sm font-normal">{`(${order.extraFee} giờ)`}</span>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <Button type="primary" small onClick={onNext}>
        Xác nhận thanh toán
      </Button>
      <BackButton onClick={onPrev} />
    </>
  );
}

export default ReceiveOrderDetail;
