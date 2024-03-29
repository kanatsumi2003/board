import TextBold from "@/components/core/TextBold";
import { PAGE_SIZE_ORDERS } from "@/constants/common";
import { IPaging } from "@/interfaces";
import { IOrderDetailItem, ORDER_STATUS, ORDER_TYPE } from "@/interfaces/order";
import { useOrdersQuery } from "@/services/orderService";
import { AppState } from "@/stores";
import { formatDate } from "@/utils/formatter";
import { renderOrderStatusTag } from "@/utils/orderStatusRender";
import { useEffect, useState } from "react";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { useSelector } from "react-redux";
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
      className="group flex flex-col gap-2 border-2 w-full p-8 border-locker-blue rounded-3xl hover:bg-locker-blue cursor-pointer hover:text-white transition-colors max-h-[400px]"
    >
      {!loading && order ? (
        <div className="flex gap-8 flex-col">
          <div className="flex w-full justify-between">
            <div className="flex gap-6">
              <div className="p-6 rounded-full bg-locker-blue group-hover:bg-white group-hover:text-locker-blue text-white flex justify-around items-center w-min">
                <MdOutlineLocalLaundryService className="text-6xl" />
              </div>
              <div className="h-full flex flex-col justify-center">
                <div className="font-bold text-4xl">#{order.id}</div>
                <div className="text-2xl text-gray-500 group-hover:text-white">
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>
            {order.status && renderOrderStatusTag(order.status)}
          </div>
          <div className="w-full flex flex-col gap-2">
            <div>
              <TextBold>Mã pin: </TextBold>
              {order.pinCode}
            </div>

            <div>
              <TextBold>Người gửi: </TextBold>
              {order.sender?.fullName
                ? `${order.sender?.fullName} (${order.sender?.phoneNumber})`
                : `${order.sender?.phoneNumber}`}
            </div>
            <div>
              <TextBold>Người nhận: </TextBold>
              {order.receiver
                ? order.receiver?.fullName
                  ? `${order.receiver?.fullName} (${order.receiver?.phoneNumber})`
                  : order.receiver?.phoneNumber
                : "Không có"}
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
  deliverySupported?: boolean;
}

function OrdersContainer({
  status,
  renderLink,
  onEmpty,
  deliverySupported,
}: Props) {
  const { locker } = useSelector((app: AppState) => app.locker);
  const [pagination, setPagination] = useState<Partial<IPaging>>();
  const {
    data: orders,
    isFetching,
    isSuccess,
  } = useOrdersQuery({
    type: ORDER_TYPE.LAUNDRY,
    pageSize: PAGE_SIZE_ORDERS,
    status: status,
    deliverySupported: deliverySupported,
    lockerId: Number(locker?.id),
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
              className="w-full grid grid-cols-1 gap-6 grid-rows-3"
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
              {[...Array(PAGE_SIZE_ORDERS).keys()].map(() => (
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
