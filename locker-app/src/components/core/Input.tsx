import useKeyboard from "@/hooks/useKeyboard";
import { AppState } from "@/stores";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Props {
  placeHolder: string;
  label: string;
  name: string;
  submitError?: string;
  onFocus: () => void;
  value?: string;
  validate?: (value: string) => string | undefined;
  onChange?: (value: string | undefined) => void;
  required?: boolean;
}

function Input({
  label,
  onFocus,
  placeHolder,
  value,
  validate,
  name,
  submitError,
  onChange,
  required,
}: Props) {
  const [error, setError] = useState<string | undefined>();
  const { inputs } = useKeyboard();

  useEffect(() => {
    onChange && onChange(inputs?.[name]);
    setError(validate && validate(inputs?.[name] ?? ""));
  }, [inputs?.[name]]);

  return (
    <>
      <div className="flex flex-col gap-2">
        <label className="font-medium">
          {label} {required && <span className="text-red-600 text-lg">*</span>}
        </label>
        <input
          type="text"
          autoFocus
          className="rounded-lg border border-black w-full p-4 focus:outline-locker-blue mt-4"
          placeholder={placeHolder}
          name={name}
          required
          onClick={onFocus}
          onFocus={onFocus}
          value={inputs?.[name]}
        />

        {(submitError || error) && (
          <div className="col-span-1 text-locker-red">
            {submitError ?? error}
          </div>
        )}
      </div>
    </>
  );
}

export default Input;
