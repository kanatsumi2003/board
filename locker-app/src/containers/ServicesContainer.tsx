import { useServicesQuery } from "@/services/serviceService";
import { formatCurrency } from "@/utils/formatter";
import { Navigation, Pagination } from "swiper/modules";

import QuantityInput from "@/components/core/QuantityInput";
import { PAGE_SIZE_SERVICES } from "@/constants/common";
import useModal from "@/hooks/useModal";
import { IPaging } from "@/interfaces";
import { IOrderServiceItem } from "@/interfaces/order";
import { IServiceItem } from "@/interfaces/service";
import { AppState } from "@/stores";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Swiper, SwiperSlide } from "swiper/react";

interface ServiceItemProps {
  service?: IServiceItem;
  isChoosing?: boolean;
  onChoose?: () => void;
  isLoading?: boolean;
  quantity?: number;
  updateQuantity?: ({ serviceId, quantity }: IOrderServiceItem) => void;
}

function ServiceItem({
  isChoosing,
  onChoose,
  isLoading,
  service,
  quantity,
  updateQuantity,
}: ServiceItemProps) {
  if (!service) {
    return <></>;
  }

  return (
    <div
      className={`flex gap-8 p-8 border-2 ${
        quantity
          ? "bg-locker-blue text-white hover:bg-opacity-90"
          : "border-locker-blue text-black hover:bg-gray-100"
      } rounded-xl cursor-pointer md:h-full  items-center justify-between`}
      onClick={() => !isLoading && onChoose && onChoose()}
      key={service.id}
    >
      {isLoading ? (
        <Skeleton className="w-96 h-[280px] rounded-lg" />
      ) : (
        <img
          src={service.image}
          alt=""
          className="w-[400px] h-full md:max-h-[280px] xl:max-h-[140px] object-cover rounded-lg"
        />
      )}

      <div className="flex flex-col justify-end gap-4 text-ellipsis text-right">
        <div>
          <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap text-4xl leading-relaxed">
            {isLoading ? (
              <Skeleton count={1} className="xl:w-40 w-96" />
            ) : (
              service?.name
            )}
          </div>
          <div className="text-2xl italic text-ellipsis line-clamp-1">
            {service.description}
          </div>
        </div>
        <div className="text-right text-2xl">
          {isLoading ? (
            <Skeleton count={2} />
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                Đơn giá: <span>{`${formatCurrency(service.price ?? 0)}`}</span>
              </div>
              <div>
                Đơn vị: <span>{service?.unit}</span>
              </div>

              <div className="flex items-center gap-4 justify-end">
                Số lượng:{" "}
                <QuantityInput
                  value={quantity ?? 0}
                  onChange={(value) => {
                    updateQuantity &&
                      updateQuantity({
                        ...service,
                        serviceId: Number(service.id),
                        quantity: value,
                      });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface Props {
  onBack: () => void;
  onChange: (selectedServices: IOrderServiceItem[]) => void;
}

function ServiceContainer({ onBack, onChange }: Props) {
  const { locker } = useSelector((state: AppState) => state.locker);
  const [pagination, setPagination] = useState<Partial<IPaging>>();
  const modal = useModal();
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const [services, setServices] = useState<IOrderServiceItem[]>(
    orderRequest?.details ?? []
  );

  const {
    data: dataServices,
    isFetching: servicesIsFetching,
    isSuccess: serviceIsSuccess,
  } = useServicesQuery(
    { lockerId: Number(locker?.id), ...pagination },
    {
      skip: !locker,
    }
  );

  useEffect(() => {
    onChange(services);
  }, [services]);

  useEffect(() => {
    if (serviceIsSuccess && !servicesIsFetching && !dataServices.totalCount) {
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
      className="h-full w-full px-16 pb-12 mt-6"
    >
      {[...Array(dataServices?.totalPages).keys()].map((element) => (
        <SwiperSlide
          key={element}
          className="grid xl:grid-cols-3 grid-cols-1 md:grid-rows-3 xl:grid-rows-2 gap-4 w-full items-center"
        >
          {element + 1 === dataServices?.pageNumber ? (
            <>
              {dataServices?.items.map((service) => (
                <ServiceItem
                  service={service}
                  updateQuantity={({ serviceId, quantity }) => {
                    setServices((prev) => [
                      ...prev.filter((value) => value.serviceId !== service.id),
                      { ...service, serviceId, quantity, price: service.price },
                    ]);
                  }}
                  onChoose={() => {
                    if (
                      Number(
                        services.find((value) => value.serviceId == service.id)
                          ?.quantity
                      ) == 0
                    ) {
                      setServices((prev) => [
                        ...prev.filter(
                          (value) => value.serviceId !== service.id
                        ),
                        {
                          ...service,
                          serviceId: service.id,
                          quantity: 1,
                          price: service.price,
                        },
                      ]);
                    } else {
                      setServices((prev) => [
                        ...prev.filter(
                          (value) => value.serviceId !== service.id
                        ),
                      ]);
                    }
                  }}
                  key={service.id}
                  quantity={
                    services.find((s) => s.serviceId === service.id)
                      ?.quantity ?? 0
                  }
                />
              ))}
            </>
          ) : (
            <>
              {[...Array(PAGE_SIZE_SERVICES).keys()].map((data) => (
                <ServiceItem isLoading key={data} />
              ))}
            </>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default ServiceContainer;
