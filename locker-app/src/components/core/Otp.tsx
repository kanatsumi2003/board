import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { useEffect, useRef, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import OTPInput from "react-otp-input";
import { useSelector } from "react-redux";

interface Props {
  otp: string;
  setOtp: (otp: string) => void;
}

function Otp({ otp, setOtp }: Props) {
  const { inputs } = useSelector((state: AppState) => state.global);
  const [showPassword, setShowPassword] = useState(false);
  const ref = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    store.dispatch(
      updateInputs({
        otp: "",
      })
    );
    setOtp("");
  }, []);

  useEffect(() => {
    if (inputs) {
      setOtp(inputs["otp"]);
    }
  }, [inputs]);

  useEffect(() => {
    ref.current[otp.length ?? 0]?.focus();
  }, [otp]);

  return (
    <div className="text-2xl font-semibold relative">
      <OTPInput
        value={otp}
        onChange={setOtp}
        inputStyle={{
          width: 60,
          fontSize: 40,
          padding: 4,
        }}
        containerStyle={{
          gap: 4,
        }}
        numInputs={6}
        renderSeparator={<span className="mx-1">-</span>}
        renderInput={(props, index) => (
          <input
            {...props}
            ref={(input) => (ref.current[index] = input)}
            onClick={() => {
              ref.current[index]?.focus();
              store.dispatch(
                setGlobalState({
                  keyboard: {
                    maxLength: 6,
                    onlyNumber: true,
                    inputName: "otp",
                  },
                })
              );
            }}
            className={`p-4 rounded-lg border-solid border-2 focus-visible:outline-locker-blue`}
          />
        )}
        inputType={showPassword ? "number" : "password"}
        shouldAutoFocus
      />
      <div
        className="absolute -right-8 bg-locker-blue rounded-md flex items-center w-16 justify-center top-0 bottom-0 translate-x-full text-white cursor-pointer hover:bg-opacity-90"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
      </div>
    </div>
  );
}

export default Otp;
