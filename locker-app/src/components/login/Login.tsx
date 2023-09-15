import useKeyboard from "@/hooks/useKeyboard";
import useModal from "@/hooks/useModal";
import { useLoginStaffMutation } from "@/services/authService";
import TokenService from "@/services/tokenService";
import store from "@/stores";
import { setGlobalState } from "@/stores/global.store";
import { isValidPhone } from "@/utils/validator";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaAngleRight } from "react-icons/fa6";
import BackButton from "../core/BackButton";
import Button from "../core/Button";

interface LoginForm {
  phoneNumber?: string;
  password?: string;
}

interface Props {
  onNext: () => void;
}

function Login({ onNext }: Props) {
  const [otp, setOtp] = useState("");
  const { inputs } = useKeyboard();
  const [form, setForm] = useState<LoginForm>();
  const [error, setError] = useState<LoginForm>();
  const [loginStaff, { isSuccess, data, isError, error: loginError }] =
    useLoginStaffMutation();
  const [showPassword, setShowPassword] = useState(false);
  const modal = useModal();
  const { open, clear } = useKeyboard();

  const showKeyboard = (inputName: string, onlyNumber: boolean) => {
    open({
      maxLength: onlyNumber ? 10 : 100,
      inputName: inputName,
      onlyNumber: onlyNumber,
    });
  };

  useEffect(() => {
    clear(["phoneNumber", "password"]);
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
  }, [form?.phoneNumber, form?.password]);

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
        username: form?.phoneNumber,
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
    showKeyboard("phoneNumber", true);
  }, []);

  return (
    <>
      <div
        className={`absolute top-0 left-0 right-0 bg-locker-blue h-48 rounded-b-[120px] -z-10`}
      ></div>
      <div className="text-5xl font-bold mt-8 text-white">
        Đăng nhập tài khoản nhân viên
      </div>
      <div className="font-semibold flex flex-col gap-4 mt-28">
        <div>
          <input
            type="text"
            autoFocus
            autoComplete="off"
            placeholder="Số điện thoại"
            className={`focus:outline-locker-blue col-span-3 text-4xl rounded-lg border border-black w-[600px] p-4 text-center ${
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
          <div className="col-span-2 text-locker-red mt-4">
            {error?.phoneNumber ?? ""}
          </div>
        </div>
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className={`focus:outline-locker-blue col-span-3 text-4xl rounded-lg border border-black w-[600px] p-4 text-center ${
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
          <div className="col-span-2 text-locker-red mt-4">
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
