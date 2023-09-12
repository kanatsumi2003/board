import { IPaging } from "@/interfaces";
import { IOrderDetailItem, ORDER_STATUS, ORDER_TYPE } from "@/interfaces/order";
import { useOrdersQuery } from "@/services/orderService";
import { useState } from "react";
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
      className="flex flex-col gap-2 border-2 w-full px-8 py-4 border-locker-blue rounded-xl text-2xl hover:bg-locker-blue cursor-pointer hover:text-white transition-colors max-h-[240px]"
    >
      {!loading && order ? (
        <>
          <div className="font-bold text-2xl">#{order.id}</div>
          <div>
            <b>Mã Pin: </b>
            {order.pinCode}
          </div>
          <div>
            <b>Ô tủ: </b>
            {order.sendBox?.number}
          </div>
          <div>
            <b>Người gửi: </b>
            {order.sender?.fullName
              ? `${order.sender?.fullName} (${order.sender?.phoneNumber})`
              : order.sender?.phoneNumber}
          </div>
          {order.receiver && (
            <div>
              <b>Người nhận: </b>
              {order.receiver?.fullName
                ? `${order.receiver?.fullName} (${order.receiver?.phoneNumber})`
                : order.receiver?.phoneNumber}
            </div>
          )}
        </>
      ) : (
        <Skeleton count={4}></Skeleton>
      )}
    </div>
  );
}

interface Props {
  renderLink: (id: number) => string;
  status: ORDER_STATUS;
}

function OrdersContainer({ status, renderLink }: Props) {
  const [pagination, setPagination] = useState<Partial<IPaging>>();
  const { data: orders } = useOrdersQuery({
    type: ORDER_TYPE.LAUNDRY,
    pageSize: 4,
    status: status,
    ...pagination,
  });

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
      className="h-full w-full px-12 pb-12"
    >
      {[...Array(orders?.totalPages).keys()].map((element) => {
        if (element + 1 === orders?.pageNumber) {
          return (
            <SwiperSlide
              key={element}
              className="w-full grid grid-cols-2 gap-6"
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
              className="grid grid-cols-2 gap-4 w-full overflow-y-scroll"
            >
              {[...Array(4).keys()].map(() => (
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
