import useModal from "@/hooks/useModal";
import { useLoginStaffMutation } from "@/services/authService";
import TokenService from "@/services/tokenService";
import store, { AppState } from "@/stores";
import { setGlobalState, updateInputs } from "@/stores/global.store";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { useSelector } from "react-redux";
import BackButton from "../core/BackButton";
import Button from "../core/Button";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

interface LoginForm {
  phoneNumber?: string;
  password?: string;
}
function Login({ onNext }: { onNext: () => void }) {
  const [otp, setOtp] = useState("");
  const { inputs } = useSelector((state: AppState) => state.global);
  const [form, setForm] = useState<LoginForm>();
  const [error, setError] = useState<LoginForm>();
  const [loginStaff, { isSuccess, data, isError, error: loginError }] =
    useLoginStaffMutation();
  const [showPassword, setShowPassword] = useState(false);
  const modal = useModal();

  const showKeyboard = (inputName: string, onlyNumber: boolean) => {
    store.dispatch(
      setGlobalState({
        keyboard: {
          maxLength: 100,
          inputName: inputName,
          onlyNumber: onlyNumber,
        },
      })
    );
  };

  useEffect(() => {
    store.dispatch(
      updateInputs({
        phoneNumber: "",
        password: "",
      })
    );
  }, []);

  useEffect(() => {
    if (inputs) {
      setForm({
        phoneNumber: inputs["phoneNumber"],
        password: inputs["password"],
      });
    }
    if (inputs && inputs["default"]) {
      setOtp(inputs["default"]);
    }
  }, [inputs]);

  useEffect(() => {
    validate();
  }, [form]);

  const validate = () => {
    if (form?.phoneNumber && !isValidPhone(form.phoneNumber)) {
      setError((prev) => ({
        ...prev,
        phoneNumber: "Số điện thoại không hợp lệ.",
      }));
    } else {
      setError((prev) => ({ ...prev, phoneNumber: undefined }));
    }

    setError((prev) => ({ ...prev, password: undefined }));
  };

  const handleLogin = () => {
    if (!form?.phoneNumber) {
      setError((prev) => ({
        ...prev,
        phoneNumber: "Vui lòng nhập Số điện thoại.",
      }));
    }
    if (!form?.password) {
      setError((prev) => ({
        ...prev,
        password: "Vui lòng nhập Mật khẩu.",
      }));
    }
    if (
      !error?.password &&
      !error?.phoneNumber &&
      form?.password &&
      form.phoneNumber
    ) {
      loginStaff({
        phoneNumber: form?.phoneNumber,
        password: form?.password,
      });
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      TokenService.setAccessToken(data.accessToken);
      TokenService.setRefreshToken(data.refreshToken);
      onNext();
    }
    if (isError && error) {
      modal.error({ message: loginError?.message?.message });
    }
  }, [isSuccess, isError]);

  useEffect(() => {
    store.dispatch(
      setGlobalState({
        keyboard: {
          maxLength: 10,
          onlyNumber: true,
          inputName: "phoneNumber",
        },
      })
    );
  }, []);

  return (
    <>
      <div
        className={`absolute top-0 left-0 right-0 bg-locker-blue h-40 rounded-b-[120px] -z-10`}
      ></div>
      <div className="text-4xl font-bold mt-8 text-white">
        Đăng nhập tài khoản nhân viên
      </div>
      <div className="text-2xl font-semibold flex flex-col gap-4 mt-16">
        <div>
          <input
            type="text"
            autoFocus
            autoComplete="off"
            placeholder="Số điện thoại"
            className={`focus:outline-locker-blue col-span-3 rounded-lg border border-black w-96 p-2 text-2xl text-center ${
              error?.phoneNumber ? "border-locker-red" : ""
            }`}
            name="phoneNumber"
            required
            onClick={() => {
              showKeyboard("phoneNumber", true);
            }}
            onFocus={() => {
              showKeyboard("phoneNumber", true);
            }}
            value={form?.phoneNumber}
          />
          <div className="col-span-2 text-base text-locker-red mt-1 h-4">
            {error?.phoneNumber ?? ""}
          </div>
        </div>
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`focus:outline-locker-blue col-span-3 rounded-lg border border-black w-96 p-2 text-2xl text-center ${
                error?.password ? "border-locker-red" : ""
              }`}
              name="password"
              placeholder="Mật khẩu"
              autoComplete="off"
              required
              onClick={() => {
                showKeyboard("password", false);
              }}
              onFocus={() => {
                showKeyboard("password", false);
              }}
              value={form?.password}
            />
            <div
              className="absolute -right-4 bg-locker-blue rounded-md flex items-center w-14 justify-center top-0 bottom-0 translate-x-full text-white cursor-pointer hover:bg-opacity-90"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>
          <div className="col-span-2 text-base text-locker-red mt-1 h-4">
            {error?.password ?? ""}
          </div>
        </div>
        <Button
          onClick={handleLogin}
          type="primary"
          icon={<FaAngleRight className="group-hover:translate-x-0.5" />}
          small
        >
          Đăng nhập
        </Button>
      </div>
      <BackButton />
    </>
  );
}

export default Login;
