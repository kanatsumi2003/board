import useKeyboard from "@/hooks/useKeyboard";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import { getTime } from "@/utils/converter";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Select from "../core/Select";
import Asterisk from "../core/Asterisk";
import TextBold from "../core/TextBold";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendReceiveTime({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);
  const { orderSettings, informationSettings } = useSelector(
    (state: AppState) => state.setting
  );
  const minDateTime = dayjs()
    .add(orderSettings?.minTimeProcessLaundryOrderInHours ?? 0, "hour")
    .startOf("hour");

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | undefined>(
    orderRequest?.intendedReceiveAt
      ? dayjs(orderRequest?.intendedReceiveAt).startOf("date")
      : undefined
  );
  const [dates, setDates] = useState<dayjs.Dayjs[]>([]);
  const [times, setTimes] = useState<number[]>();
  const [selectedTime, setSelectedTime] = useState<number | undefined>(
    orderRequest?.intendedReceiveAt
      ? dayjs(orderRequest?.intendedReceiveAt).hour()
      : undefined
  );
  const { close } = useKeyboard();

  useEffect(() => {
    close();
    setDates(getListDate());
  }, []);

  const handleNext = () => {
    console.log(selectedDate?.toISOString(), selectedTime);
    store.dispatch(
      setOrderRequest({
        intendedReceiveAt: selectedDate
          ?.add(selectedTime ?? 0, "hour")
          ?.toISOString(),
      })
    );
    onNext();
  };

  useEffect(() => {
    if (selectedDate) {
      const times = [...Array(24).keys()]
        .filter((data) =>
          selectedDate?.startOf("date").isSame(minDateTime.startOf("date"))
            ? data > minDateTime.hour()
            : true
        )
        .filter((data) => {
          return (
            data >= getTime(informationSettings?.openedAt) &&
            data <= getTime(informationSettings?.closedAt)
          );
        });
      setTimes(times);
      setSelectedTime(times?.[0] ?? undefined);
    } else {
      setSelectedTime(undefined);
      setTimes(undefined);
    }
  }, [selectedDate]);

  const getListDate = () => {
    const firstDate = minDateTime.startOf("date");
    return [...Array(4).keys()].map((number) => firstDate.add(number, "day"));
  };

  return (
    <>
      <div className="mt-8 flex flex-col px-12 gap-8">
        <div className="w-full grid grid-cols-2 gap-12 mt-4">
          <Select
            label="Hẹn ngày nhận:"
            data={
              dates?.map((data, index) => ({
                label: data.format("DD-MM-YYYY"),
                value: data.toISOString(),
                key: data.toISOString(),
              })) ?? []
            }
            className="mt-4"
            name="date"
            value={selectedDate?.toISOString()}
            placeholder="Hẹn ngày nhận"
            onChange={({ value }) => {
              setSelectedDate(value ? dayjs(value) : undefined);
            }}
            onClear={() => {
              setSelectedDate(undefined);
            }}
            menuPlacement="bottom"
            searchable={false}
          />
          <Select
            label="Hẹn giờ nhận:"
            data={
              times?.map((data, index) => ({
                label: `${data}:00`,
                value: `${data}`,
                key: `${data}`,
              })) ?? []
            }
            className="mt-4"
            name="time"
            value={
              !selectedDate
                ? undefined
                : selectedTime
                ? `${selectedTime}`
                : `${times?.[0]}`
            }
            placeholder="Hẹn giờ nhận"
            onChange={({ value }) => {
              setSelectedTime(Number(value));
            }}
            onClear={() => {
              setSelectedTime(0);
            }}
            menuPlacement="bottom"
            searchable={false}
          />
        </div>

        <div>
          <Asterisk /> Nếu bỏ qua bước này, chúng tôi sẽ{" "}
          <TextBold>hoàn trả sau khi hoàn tất xử lý đơn hàng</TextBold> và gửi
          thông báo đến bạn.
        </div>
        <Button type="primary" className="mt-8" small onClick={handleNext}>
          {selectedDate ? "Tiếp theo" : "Bỏ qua bước này"}
        </Button>
        <BackStepButton onClick={onPrev} />
      </div>
    </>
  );
}

export default SendReceiveTime;
