import useKeyboard from "@/hooks/useKeyboard";
import store, { AppState } from "@/stores";
import { setOrderRequest } from "@/stores/order.store";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BackStepButton from "../core/BackStepButton";
import Button from "../core/Button";
import Select from "../core/Select";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

function SendReceiveTime({ onNext, onPrev }: Props) {
  const { orderRequest } = useSelector((state: AppState) => state.order);

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
      setTimes(
        [...Array(24).keys()].filter((data) =>
          selectedDate?.startOf("date").isSame(dayjs().startOf("date"))
            ? data > dayjs().hour()
            : true
        )
      );
    } else {
      setSelectedTime(undefined);
      setTimes(undefined);
    }
  }, [selectedDate]);

  // HARD CODE ADD 8 HOURS
  const getListDate = () => {
    const firstDate = dayjs().add(8, "hour").startOf("date");
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
            onChange={(value) => {
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
            onChange={(value) => {
              setSelectedTime(Number(value));
            }}
            onClear={() => {
              setSelectedTime(0);
            }}
            menuPlacement="bottom"
            searchable={false}
          />
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
