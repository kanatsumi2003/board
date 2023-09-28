import { IPaging } from "@/interfaces";
import { IOrderDetailItem, ORDER_STATUS, ORDER_TYPE } from "@/interfaces/order";
import { useOrdersQuery } from "@/services/orderService";
import { formatDate } from "@/utils/formatter";
import { renderOrderStatusTag } from "@/utils/orderStatusRender";
import { useState, useEffect } from "react";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

interface OrderItemProps extends Partial<IOrderDetailItem> {
  loading?: boolean;
  url?: string;
}

function OrderItem({ loading, url, ...order }: OrderItemProps) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => url && navigate(url)}
      className="flex flex-col gap-2 border-2 w-full p-8 border-locker-blue rounded-3xl hover:bg-locker-blue cursor-pointer hover:text-white transition-colors max-h-[400px]"
    >
      {!loading && order ? (
        <div className="flex gap-8 flex-col">
          <div className="flex w-full justify-between">
            <div className="flex gap-6">
              <div className="p-6 rounded-full bg-locker-blue text-white flex justify-around items-center w-min">
                <MdOutlineLocalLaundryService className="text-6xl" />
              </div>
              <div className="h-full flex flex-col justify-center">
                <div className="font-bold text-4xl">#{order.id}</div>
                <div className="text-2xl text-gray-500">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
            {order.status && renderOrderStatusTag(order.status)}
          </div>
          <div className="w-full">
            <div>
              <b>Mã pin: </b>
              {order.pinCode}
            </div>
            <div>
              <div>
                <b>Trạng thái: </b>
                {order.status}
              </div>
              <div>
                <b>Ô tủ: </b>
                {order.sendBox?.number}
              </div>
              <div>
                <b>Người gửi: </b>
                {order.sender?.fullName
                  ? `${order.sender?.fullName} (${order.sender?.phoneNumber})`
                  : `${order.sender?.phoneNumber} (${order.sender?.phoneNumber})`}
              </div>
              <div>
                <b>Người nhận: </b>
                {order.receiver
                  ? order.receiver?.fullName
                    ? `${order.receiver?.fullName} (${order.receiver?.phoneNumber})`
                    : order.receiver?.phoneNumber
                  : "Không có"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton count={4}></Skeleton>
      )}
    </div>
  );
}

interface Props {
  renderLink: (id: number) => string;
  onEmpty?: () => void;
  status: ORDER_STATUS;
}

function OrdersContainer({ status, renderLink, onEmpty }: Props) {
  const [pagination, setPagination] = useState<Partial<IPaging>>();
  const {
    data: orders,
    isFetching,
    isSuccess,
  } = useOrdersQuery({
    type: ORDER_TYPE.LAUNDRY,
    pageSize: 3,
    status: status,
    ...pagination,
  });

  useEffect(() => {
    if (!isFetching && isSuccess && orders && !orders.totalCount) {
      onEmpty && onEmpty();
    }
  }, [isFetching, isSuccess, orders]);

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      spaceBetween={180}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      onSlideChange={(swiper) =>
        setPagination((prev) => ({
          ...prev,
          pageNumber: swiper.activeIndex + 1,
        }))
      }
      className="h-full w-full px-16 pb-12"
    >
      {[...Array(orders?.totalPages).keys()].map((element) => {
        if (element + 1 === orders?.pageNumber) {
          return (
            <SwiperSlide
              key={element}
              className="w-full grid grid-cols-1 gap-6"
            >
              {orders?.items.map((order) => (
                <OrderItem {...order} url={renderLink(order.id)} />
              ))}
            </SwiperSlide>
          );
        } else {
          return (
            <SwiperSlide
              key={element}
              className="grid grid-cols-1 gap-4 w-full overflow-y-scroll"
            >
              {[...Array(3).keys()].map(() => (
                <OrderItem loading />
              ))}{" "}
            </SwiperSlide>
          );
        }
      })}
    </Swiper>
  );
}

export default OrdersContainer;
