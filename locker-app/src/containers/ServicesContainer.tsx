import { useServicesQuery } from "@/services/serviceService";
import { formatCurrency } from "@/utils/formatter";
import { Navigation, Pagination } from "swiper/modules";

import { IPaging } from "@/interfaces";
import { useLockerQuery } from "@/services/lockerService";
import { AppState } from "@/stores";
import { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";
import useModal from "@/hooks/useModal";

function ServiceItem({
  id,
  image,
  name,
  isChoosing,
  onChoose,
  unit,
  price,
  isLoading,
}: {
  id?: number;
  price?: number;
  unit?: string;
  image?: string;
  name?: string;
  isChoosing?: boolean;
  onChoose?: () => void;
  isLoading?: boolean;
}) {
  return (
    <div
      className={`flex gap-2 p-2 px-4 border-2  ${
        isChoosing
          ? "bg-locker-blue text-white hover:bg-opacity-90"
          : "border-locker-blue text-black hover:bg-gray-100"
      } rounded-lg cursor-pointer h-28 items-center justify-between`}
      onClick={() => !isLoading && onChoose && onChoose()}
      key={id}
    >
      {isLoading ? (
        <Skeleton className="w-28 h-20 rounded-lg" />
      ) : (
        <img src={image} alt="" className="w-28 h-20 object-cover rounded-lg" />
      )}

      <div className="flex flex-col justify-center gap-2 ml-2 text-ellipsis">
        <div className="font-bold text-lg overflow-hidden text-ellipsis whitespace-nowrap text-right">
          {isLoading ? <Skeleton count={1} className="xl:w-40 w-16" /> : name}
        </div>
        <div className="text-sm text-right">
          {isLoading ? (
            <Skeleton count={2} />
          ) : (
            <>
              Đơn giá: <span>{`${formatCurrency(price ?? 0)}/${unit}`}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceContainer({
  serviceIds,
  setServiceIds,
  onBack,
}: {
  serviceIds: number[];
  onBack: () => void;
  setServiceIds: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [pagination, setPagination] = useState<Partial<IPaging>>();
  const modal = useModal();
  const { data: lockerQuery } = useLockerQuery(
    { id: Number(locker?.id) },
    { skip: !locker?.id }
  );
  const {
    data: services,
    isFetching: servicesIsFetching,
    isSuccess: serviceIsSuccess,
  } = useServicesQuery(
    { storeId: Number(lockerQuery?.store.id), ...pagination },
    {
      skip: !lockerQuery?.store.id,
    }
  );

  useEffect(() => {
    if (serviceIsSuccess && !servicesIsFetching && !services.totalCount) {
      modal.error({
        message: "Hiện không có dịch vụ nào tồn tại",
        onClose: () => onBack(),
      });
    }
  }, [servicesIsFetching, serviceIsSuccess]);

  return (
    <Swiper
      // install Swiper modules
      modules={[Navigation, Pagination]}
      slidesPerView={1}
      spaceBetween={80}
      navigation
      pagination={{ clickable: true, dynamicBullets: true }}
      onSwiper={(swiper) => {}}
      onSlideChange={(swiper) =>
        setPagination((prev) => ({
          ...prev,
          pageNumber: swiper.activeIndex + 1,
        }))
      }
      className="h-full w-full px-12 pb-12 mt-6"
    >
      {[...Array(services?.totalPages).keys()].map((element) => {
        if (element + 1 === services?.pageNumber) {
          return (
            <SwiperSlide
              key={element}
              className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 w-full overflow-y-scroll items-center"
            >
              {services?.items.map((service) => (
                <ServiceItem
                  id={service.id}
                  image={service.image}
                  name={service.name}
                  isChoosing={serviceIds.includes(service.id)}
                  onChoose={() => {
                    if (!serviceIds.includes(service.id)) {
                      setServiceIds((prev) => [...prev, service.id]);
                    } else {
                      setServiceIds((prev) => [
                        ...prev.filter((value) => value !== service.id),
                      ]);
                    }
                  }}
                  price={service.price}
                  unit={service.unit}
                  key={service.id}
                />
              ))}
            </SwiperSlide>
          );
        } else {
          return (
            <SwiperSlide
              key={element}
              className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-4 w-full overflow-y-scroll"
            >
              {[...Array(9).keys()].map((data) => (
                <ServiceItem isLoading key={data} />
              ))}
            </SwiperSlide>
          );
        }
      })}
    </Swiper>
  );
}

export default ServiceContainer;
