import { useEffect, useState } from "react";

interface Props {
  className?: string;
  label?: string;
  onChange: (value: boolean) => void;
}

function Switch({ label, onChange, className }: Props) {
  const [check, setCheck] = useState(false);

  useEffect(() => {
    onChange(check);
  }, [check]);

  return (
    <label className={`${className} w-max flex items-center cursor-pointer`}>
      <div className="relative">
        <input
          type="checkbox"
          checked={check}
          className="sr-only"
          onChange={() => setCheck((prev) => !prev)}
        />
        <div className="block bg-gray-200 shadow-sm w-24 h-14 rounded-full"></div>
        <div className="dot absolute left-2 top-2 bg-white w-10 h-10 rounded-full transition-all shadow-sm"></div>
      </div>
      <div className="ml-3 font-medium">{label}</div>
    </label>
  );
}

export default Switch;
