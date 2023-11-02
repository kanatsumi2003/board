import useKeyboard from "@/hooks/useKeyboard";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { useEffect, useRef, useState } from "react";
import Keyboard, { KeyboardReactInterface } from "react-simple-keyboard";
import "simple-keyboard/build/css/index.css";

enum KEYBOARD_LAYOUT {
  DEFAULT = "default",
  SHIFT = "shift",
  NUMBERS = "numbers",
  ALT = "alt",
}

interface Props {
  show?: boolean;
  maxLength: number;
  inputName?: string;
  onChangeAll: (values: { [key: string]: string }) => void;
  onlyNumber?: boolean;
  uppercase?: boolean;
  disablePositioning?: boolean;
}

function VirtualKeyboard({
  maxLength,
  inputName,
  show,
  onChangeAll,
  onlyNumber,
  uppercase,
  disablePositioning,
}: Props) {
  const [layout, setLayout] = useState<KEYBOARD_LAYOUT>(
    KEYBOARD_LAYOUT.DEFAULT
  );
  const { keyboard, inputs } = useKeyboard();
  const keyboardRef = useRef<KeyboardReactInterface | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const onKeyPress = (button: string) => {
    if (button.includes("{") && button.includes("}")) {
      handleLayoutChange(button);
    }
  };

  useEffect(() => {
    if (inputs) {
      Object.keys(inputs).forEach((key) => {
        keyboardRef.current?.setInput(inputs[key], key);
      });
    }
  }, [inputs]);

  useEffect(() => {
    if (keyboard) {
      if (onlyNumber) {
        setLayout(KEYBOARD_LAYOUT.NUMBERS);
      } else if (uppercase) {
        setLayout(KEYBOARD_LAYOUT.SHIFT);
      } else {
        setLayout(KEYBOARD_LAYOUT.DEFAULT);
      }
    }
  }, [keyboard, onlyNumber, uppercase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // if (ref.current && !ref.current.contains(event.target as Node)) {
      //   store.dispatch(
      //     setGlobalState({
      //       keyboard: undefined,
      //     })
      //   );
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLayoutChange = (button: string) => {
    let currentLayout = layout;
    let layoutName: KEYBOARD_LAYOUT = KEYBOARD_LAYOUT.DEFAULT;

    switch (button) {
      case "{downkeyboard}": {
        store.dispatch(
          setGlobalState({
            keyboard: undefined,
          })
        );
        layoutName = layout;
        break;
      }
      case "{shift}":
      case "{shiftactivated}":
      case "{default}":
        layoutName =
          currentLayout === KEYBOARD_LAYOUT.DEFAULT
            ? KEYBOARD_LAYOUT.SHIFT
            : KEYBOARD_LAYOUT.DEFAULT;
        break;

      case "{alt}":
      case "{altright}":
        layoutName =
          currentLayout === KEYBOARD_LAYOUT.ALT
            ? KEYBOARD_LAYOUT.DEFAULT
            : KEYBOARD_LAYOUT.ALT;
        break;

      default:
        layoutName = layout;
        break;
    }

    if (layoutName) {
      setLayout(layoutName);
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 shadow-lg transition-all ${
        show ? "" : "translate-y-full"
      }`}
      ref={ref}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        inputName={inputName}
        layoutName={layout}
        layout={{
          default: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "q w e r t y u i o p",
            "a s d f g h j k l",
            "{shift} z x c v b n m , .",
            "{alt} {space} {downkeyboard}",
          ],
          shift: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "Q W E R T Y U I O P",
            "A S D F G H J K L",
            "{shiftactivated} Z X C V B N M , .",
            "{alt} {space} {downkeyboard}",
          ],
          alt: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "! @ # $ % ^ & * ( )",
            "? ~ ` | \\ \" ' [ ]",
            "{shift} % - + = / ; : { }",
            "{default} {space} {downkeyboard}",
          ],
          numbers: [
            "1 2 3",
            "4 5 6",
            "7 8 9",
            `${onlyNumber ? "{downkeyboard}" : "{abc}"} 0 {bksp}`,
          ],
        }}
        theme="hg-theme-default hg-layout-numeric numeric-theme"
        onChangeAll={(value, e) => {
          e?.preventDefault();
          onChangeAll(value);
        }}
        disableCaretPositioning={disablePositioning}
        mergeDisplay
        display={{
          "{alt}": ".?123",
          "{smileys}": "\uD83D\uDE03",
          "{shift}": "⇧",
          "{shiftactivated}": "⇧",
          "{enter}": "return",
          "{bksp}": "⌫",
          "{altright}": ".?123",
          "{downkeyboard}": "🞃",
          "{space}": " ",
          "{default}": "ABC",
          "{back}": "⇦",
        }}
        maxLength={maxLength}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export default VirtualKeyboard;
