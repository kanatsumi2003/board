import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: () => void;
}

function BackButton({ onClick }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="z-20 text-white bg-locker-blue text-7xl shadow-xl absolute right-10 bottom-10 rounded-full cursor-pointer"
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
