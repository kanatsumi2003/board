import dayjs from "dayjs";
import { useEffect, useState } from "react";

function useCurrent() {
  const [current, setCurrent] = useState(dayjs());
  useEffect(() => {
    const interval = setInterval(() => setCurrent(dayjs()), 1000);
    return () => clearInterval(interval);
  }, []);
  return current;
}

export default useCurrent;
