import dayjs from "dayjs";
import { useEffect, useState } from "react";

export interface Props {
  skip: boolean;
}

function useCountDown(count: number) {
  const [countDown, setCountDown] = useState(count);
  const reset = () => {
    setCountDown(count);
  };

  const set = (count: number) => {
    setCountDown(count);
  };

  useEffect(() => {
    const interval = setInterval(
      () => setCountDown((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  return {
    countDown: Math.floor(countDown),
    resetCountDown: reset,
    setCountDown: set,
  };
}

export default useCountDown;
