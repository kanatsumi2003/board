import useKeyboard from "@/hooks/useKeyboard";
import { useEffect } from "react";
import ReactSelect, { createFilter } from "react-select";

const filterConfig = {
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
};

interface IOptionType {
  key: string | number;
  value: string;
  label: string;
}

interface Props {
  data: IOptionType[];
  name: string;
  value?: string;
  placeholder: string;
  onChange: ({ value, label }: { value?: string; label?: string }) => void;
  onClear: () => void;
  menuPlacement?: "top" | "bottom";
  className?: string;
  searchable?: boolean;
  disable?: boolean;
  label: string;
}

function Select({
  data,
  name,
  onChange,
  placeholder,
  onClear,
  value,
  menuPlacement = "bottom",
  className,
  searchable = true,
  disable,
  label,
}: Props) {
  const { inputs, keyboard, close, clear, open } = useKeyboard();

  const handleChange = (selectedOption: IOptionType | null) => {
    onChange({
      label: selectedOption?.label,
      value: selectedOption?.value,
    });
    if (selectedOption) {
      close();
    } else {
      onClear();
    }
  };

  useEffect(() => {
    clear([name]);
  }, []);

  return (
    <div>
      <label className="font-medium">{label}</label>
      <ReactSelect
        className={className}
        classNames={{
          control: ({ isFocused }) =>
            `!rounded-lg !border-1 !shadow-locker-blue !p-4 mt-4 ${
              isFocused ? "!border-locker-blue !shadow-none" : "!border-black"
            }`,
          input: () => "input-container",
          valueContainer: () => "!p-0",
          menu: () => "!z-50",
          option: () => "!p-4",
        }}
        onFocus={() => {
          if (searchable) {
            open({
              maxLength: 100,
              inputName: name,
              onlyNumber: false,
            });
          }
        }}
        isClearable
        isDisabled={!data.length || disable}
        placeholder={<div className="line-clamp-1">{placeholder}</div>}
        isSearchable={searchable}
        inputValue={
          searchable
            ? data.find((d) => d.key === value)?.label ?? inputs?.[name]
            : undefined
        }
        onChange={handleChange}
        options={data}
        value={
          value
            ? data.find((d) => {
                return d.key === value;
              })
            : null
        }
        menuPlacement={menuPlacement}
        openMenuOnClick={true}
        openMenuOnFocus={true}
        blurInputOnSelect
        menuShouldScrollIntoView
        filterOption={createFilter(filterConfig)}
      />
    </div>
  );
}

export default Select;
