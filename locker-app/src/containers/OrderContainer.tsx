import { Draggable } from "@/components/core/Draggable";
import { IDetailItem } from "@/interfaces/order";
import { useOrderQuery } from "@/services/orderService";
import store from "@/stores";
import { setOrderState } from "@/stores/order.store";
import { formatCurrency, formatDate } from "@/utils/formatter";
import { useEffect } from "react";

interface Props {
  id: number;
}

function OrderContainer({ id }: Props) {
  const { data: order } = useOrderQuery({
    id: Number(id),
  });

  useEffect(() => {
    if (order) {
      store.dispatch(
        setOrderState({
          order: order,
        })
      );
    }
  }, [order]);

  if (!order) return <></>;

  return (
    <>
      <div className="flex md:flex-col xl:flex-row gap-4 w-full px-12 justify-center">
        <div className="bg-white shadow-2xl grid grid-cols-2 p-8 rounded-3xl gap-y-4 gap-x-1 basis-3/5 justify-center">
          <div className="font-semibold col-span-2 mb-2">
            Thông tin đơn hàng:
          </div>
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
        <div className="flex flex-col gap-2 basis-2/5">
          <div className="bg-white shadow-2xl p-8 rounded-3xl gap-2 h-full">
            <div className="font-semibold col-span-2 mb-2">
              Chi tiết đơn hàng:
            </div>
            <Draggable>
              <div className="flex flex-col h-full gap-2 w-full">
                {order.details.map((detail: IDetailItem) => (
                  <div
                    className={`flex p-2 bg-gray-100 rounded-lg w-full items-center md:h-52`}
                    key={detail.id}
                  >
                    <div className="h-full md:w-60 md:h-48 xl:w-32 xl:h-20 ">
                      <img
                        src={detail.service.image}
                        alt=""
                        className="h-full w-full object-cover rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col justify-center gap-1 md:ml-5 xl:ml-2 text-ellipsis xl:w-full">
                      <div className="font-bold text-4xl overflow-hidden text-ellipsis whitespace-nowrap">
                        {detail.service.name}
                      </div>
                      <div className="mt-3">
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
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderContainer;
