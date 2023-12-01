import Button from "@/components/core/Button";
import { Modal } from "@/components/core/Modal";
import useModal from "@/hooks/useModal";
import { IOrderDetailItem, ORDER_STATUS, ORDER_TYPE } from "@/interfaces/order";
import { useBoxesQuery } from "@/services/boxService";
import {
  useCollectOrderMutation,
  useProcessOvertimeOrderMutation,
} from "@/services/orderService";
import { AppState } from "@/stores";
import { formatDate } from "@/utils/formatter";
import {
  renderOrderStatus,
  renderOrderStatusColor,
} from "@/utils/orderStatusRender";
import { renderOrderTypeText } from "@/utils/orderTypeRender";
import { useEffect, useState } from "react";
import { FaBoxesPacking } from "react-icons/fa6";
import {
  MdLocalLaundryService,
  MdOutlineLock,
  MdOutlineLockClock,
  MdOutlineLockOpen,
} from "react-icons/md";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface BoxItemProps extends Partial<IOrderDetailItem> {
  boxNo?: number;
  status?: ORDER_STATUS;
  empty?: boolean;
  type?: ORDER_TYPE;
  orderId?: number;
  onClick: () => void;
}

function BoxItem({ boxNo, status, empty, type, onClick }: BoxItemProps) {
  if (empty || !status || !type) {
    return (
      <div className="relative w-full h-96  col-span-1 border-2 flex justify-center items-center rounded-xl border-locker-blue text-locker-blue p-8 flex-col">
        <div className="absolute top-8 left-8 right-8 font-bold text-5xl flex justify-between">
          <div>{boxNo}</div>
          <div>
            <MdOutlineLockOpen className="text-locker-green" />
          </div>
        </div>
        <div className="text-4xl">Ô trống</div>
      </div>
    );
  }

  if (type === ORDER_TYPE.STORAGE) {
    return (
      <div className="relative w-full h-96 col-span-1 border-2 flex justify-center items-center rounded-xl border-locker-blue text-locker-blue p-8 flex-col gap-2">
        <div className="absolute top-8 left-8 right-8 font-bold text-5xl flex justify-between">
          <div>{boxNo}</div>
          <div>
            <MdOutlineLock className="text-locker-red" />
          </div>
        </div>
        <FaBoxesPacking className={"text-[100px] lg:text-[100px] mt-12 mb-4"} />{" "}
        <div className="px-6 py-2 bg-locker-blue text-white rounded-3xl">
          {renderOrderTypeText(type)}
        </div>
        <div>{renderOrderStatus(status)}</div>
      </div>
    );
  }
  if (status === ORDER_STATUS.RESERVED) {
    return (
      <div className="relative w-full h-96  col-span-1 border-2 flex justify-center items-center rounded-xl border-locker-blue text-locker-blue p-8 flex-col gap-2">
        <div className="absolute top-8 left-8 right-8 font-bold text-5xl flex justify-between">
          <div>{boxNo}</div>
          <div>
            <MdOutlineLockClock className="text-locker-red" />
          </div>
        </div>{" "}
        <MdLocalLaundryService
          className={"text-[100px] lg:text-[100px] mt-12 mb-4"}
        />{" "}
        <div className="px-6 py-2 bg-locker-blue text-white rounded-3xl">
          {renderOrderTypeText(type)}
        </div>
        <div>{renderOrderStatus(status)}</div>
      </div>
    );
  }
  return (
    <div
      className="relative w-full h-96 col-span-1 border-2 flex justify-center items-center rounded-xl text-white p-8 flex-col gap-2"
      style={{
        backgroundColor: renderOrderStatusColor(status),
      }}
      onClick={onClick}
    >
      <div className="absolute top-8 left-8 right-8 font-bold text-5xl flex justify-between">
        <div>{boxNo}</div>
        <div>
          <MdOutlineLock className="text-locker-red" />
        </div>
      </div>
      {type === ORDER_TYPE.LAUNDRY ? (
        <MdLocalLaundryService
          className={"text-[100px] lg:text-[100px] mt-12 mb-4"}
        />
      ) : (
        <></>
      )}
      <div className="px-6 py-2 bg-white text-locker-blue rounded-3xl">
        {renderOrderTypeText(type)}
      </div>
      <div className="text-4xl text-center">{renderOrderStatus(status)}</div>
    </div>
  );
}

interface Props {
  onEmpty?: () => void;
}

function BoxesContainer({ onEmpty }: Props) {
  const modal = useModal();
  const { locker } = useSelector((app: AppState) => app.locker);
  const [order, setOrder] = useState<IOrderDetailItem & { boxNo: number }>();
  const { data, isFetching, isSuccess, refetch } = useBoxesQuery({
    id: Number(locker?.id),
  });

  const [
    collectOrder,
    {
      data: dataCollectOrder,
      isSuccess: isSuccessCollectOrder,
      isError: isErrorCollectOrder,
      error: errorCollectOrder,
    },
  ] = useCollectOrderMutation();

  const [
    processOvertimeOrder,
    {
      data: dataProcessOvertimeOrder,
      isSuccess: isSuccessProcessOvertimeOrder,
      isError: isErrorProcessOvertimeOrder,
      error: errorProcessOvertimeOrder,
    },
  ] = useProcessOvertimeOrderMutation();

  useEffect(() => {
    if (!isFetching && isSuccess && (!data || !data.length)) {
      onEmpty && onEmpty();
    }
  }, [isFetching, isSuccess, data]);

  const handleCollectOrder = () => {
    collectOrder({ id: Number(order?.id) });
  };

  const handleProcessOvertimeOrder = () => {
    processOvertimeOrder({ id: Number(order?.id) });
  };

  useEffect(() => {
    if (isSuccessCollectOrder && dataCollectOrder) {
      modal.success({
        message: `Ô tủ số ${dataCollectOrder.sendBox.number} đã được mở, vui lòng nhận đồ và đóng lại tủ`,
        onClose: () => {
          setOrder(undefined);
          refetch();
        },
      });

      return;
    }
    if (isErrorCollectOrder) {
      modal.error({ message: errorCollectOrder?.message?.message });
      return;
    }

    if (isSuccessProcessOvertimeOrder && dataProcessOvertimeOrder) {
      modal.success({
        message: `Ô tủ số ${dataProcessOvertimeOrder.sendBox.number} đã được mở, vui lòng nhận đồ và đóng lại tủ`,
        onClose: () => {
          setOrder(undefined);
          refetch();
        },
      });

      return;
    }
    if (isErrorProcessOvertimeOrder) {
      modal.error({ message: errorProcessOvertimeOrder?.message?.message });
    }
  }, [
    isSuccessCollectOrder,
    isErrorCollectOrder,
    isSuccessProcessOvertimeOrder,
    isErrorProcessOvertimeOrder,
  ]);

  return (
    <div className="grid grid-cols-3 gap-12 w-full">
      {data?.map((box) => (
        <BoxItem
          onClick={() => {
            setOrder({ ...box.lastOrder, boxNo: box.number });
          }}
          boxNo={box.number}
          empty={box.isAvailable}
          type={box.lastOrder?.type}
          status={box.lastOrder?.status}
          orderId={box.lastOrder?.id}
        />
      ))}
      {order && (
        <Modal
          onClose={() => setOrder(undefined)}
          className="flex flex-col gap-12 p-8"
        >
          <div className="font-bold text-4xl">Chi tiết đơn hàng</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Ô tủ:</div>
            <div className="font-bold text-end">#{order.boxNo}</div>

            <div>Mã PIN:</div>
            <div className="font-bold text-end">{order.pinCode}</div>

            <div>Loại đơn hàng:</div>
            <div className="font-bold text-end">
              {renderOrderTypeText(order.type)}
            </div>
            {/* 
            <div>Ô tủ:</div>
            <div className="font-bold text-end">#{order?.sendBox?.number}</div> */}

            <div>SĐT người gửi:</div>
            <div className="font-bold text-end">
              {order?.sender?.phoneNumber}
            </div>

            {order?.receiver?.phoneNumber && (
              <>
                <div>SĐT người nhận:</div>
                <div className="font-bold text-end">
                  {order?.receiver?.phoneNumber}
                </div>
              </>
            )}

            <div>Thời gian gửi:</div>
            <div className="font-bold text-end">
              {formatDate(order.createdAt)}
            </div>

            <div>Trạng thái:</div>
            <div className="font-bold text-end flex justify-end">
              {renderOrderStatus(order.status)}
            </div>
          </div>
          <Button
            type={order.status === ORDER_STATUS.WAITING ? "primary" : "warning"}
            small
            onClick={() => {
              if (order.status === ORDER_STATUS.WAITING) {
                handleCollectOrder();
                return;
              }
              if (order.status === ORDER_STATUS.OVERTIME) {
                handleProcessOvertimeOrder();
                return;
              }
            }}
          >
            {(() => {
              if (order.status === ORDER_STATUS.WAITING) {
                return <>Nhận đơn hàng về cửa hảng</>;
              }
              if (order.status === ORDER_STATUS.OVERTIME) {
                return <>Xử lý đơn hàng quá hạn</>;
              }
            })()}
          </Button>
        </Modal>
      )}
    </div>
  );
}

export default BoxesContainer;
