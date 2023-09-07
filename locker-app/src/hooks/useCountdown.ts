import { useEffect, useState } from "react";

function useCountDown(count: number) {
  const [countDown, setCountDown] = useState(count);
  const resetCountDown = () => {
    setCountDown(count);
  };
  useEffect(() => {
    const interval = setInterval(
      () => setCountDown((prev) => (prev > 0 ? prev - 1 : 0)),
      1000
    );
    return () => clearInterval(interval);
  }, []);

  return { countDown, resetCountDown };
}

export default useCountDown;
