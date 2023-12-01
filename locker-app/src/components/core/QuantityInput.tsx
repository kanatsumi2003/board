import useKeyboard from "@/hooks/useKeyboard";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";

interface Props {
  submitError?: string;
  error?: string;
  value: number;
  onChange: (value: number) => void;
  disable?: boolean;
}

function QuantityInput({
  value,
  submitError,
  onChange,
  error,
  disable,
}: Props) {
  const [v, setV] = useState(value ?? 0);

  useEffect(() => {
    onChange(v);
  }, [v]);

  useEffect(() => {
    setV(value);
  }, [value]);

  return (
    <>
      <div className="flex items-center h-16">
        <div
          className="bg-white text-black w-16 flex justify-center items-center h-full"
          onClick={(e) => {
            e.stopPropagation();
            setV((v) => {
              return v > 0 ? --v : v;
            });
          }}
        >
          <FiMinus />
        </div>
        <input
          type="number"
          className="border h-full w-20 p-4 text-3xl text-black text-end font-bold"
          required
          value={value}
        />

        <div
          className="bg-white text-black w-16 flex justify-center items-center  h-full"
          onClick={(e) => {
            e.stopPropagation();
            setV((v) => ++v);
          }}
        >
          <FiPlus />
        </div>
      </div>
    </>
  );
}

export default QuantityInput;
