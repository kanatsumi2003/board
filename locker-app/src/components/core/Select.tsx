import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ReactSelect, { createFilter } from "react-select";

const filterConfig = {
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
};

interface IOptionType {
  key: string;
  value: string;
  label: string;
}

function Select({
  data,
  name,
  onChange,
  placeholder,
  onClear,
  value,
}: {
  data: IOptionType[];
  name: string;
  value?: string;
  placeholder: string;
  onChange: (option?: string) => void;
  onClear: () => void;
}) {
  const { inputs, keyboard } = useSelector((state: AppState) => state.global);
  const handleChange = (selectedOption: IOptionType | null) => {
    onChange(selectedOption?.value);
    if (selectedOption) {
      store.dispatch(
        setGlobalState({
          keyboard: undefined,
        })
      );
    } else {
      onClear();
    }
  };
  useEffect(() => {
    store.dispatch(
      updateInputs({
        [name]: "",
      })
    );
  }, []);

  return (
    <ReactSelect
      classNames={{
        control: ({ isFocused }) =>
          `!rounded-lg !border-1 !shadow-locker-blue ${
            isFocused ? "!border-locker-blue !shadow-none" : "!border-black"
          }`,
        input: () => "input-container",
      }}
      onFocus={() =>
        store.dispatch(
          setGlobalState({
            keyboard: {
              maxLength: 100,
              inputName: name,
              onlyNumber: false,
            },
          })
        )
      }
      isClearable
      isDisabled={!data.length}
      placeholder={<div className="line-clamp-1">{placeholder}</div>}
      value={data.find((d) => d.key === value) ?? null}
      isSearchable
      inputValue={data.find((d) => d.key === value)?.label ?? inputs?.[name]}
      onChange={handleChange}
      menuIsOpen={keyboard?.inputName === name}
      options={data}
      menuPlacement="top"
      maxMenuHeight={180}
      openMenuOnFocus={true}
      blurInputOnSelect
      menuShouldScrollIntoView
      filterOption={createFilter(filterConfig)}
    />
  );
}

export default Select;
