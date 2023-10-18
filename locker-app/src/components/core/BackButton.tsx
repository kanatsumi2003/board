import useKeyboard from "@/hooks/useKeyboard";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: () => void;
}

function BackButton({ onClick }: Props) {
  const navigate = useNavigate();
  const { keyboard } = useKeyboard();

  return (
    <div
      className={`z-20 text-white bg-locker-blue text-8xl shadow-xl absolute right-10 rounded-full cursor-pointer transition-all ${
        keyboard ? "bottom-[580px]" : "bottom-10"
      }`}
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          navigate(-1);
        }
      }}
    >
      <IoArrowBackCircle />
    </div>
  );
}

export default BackButton;
