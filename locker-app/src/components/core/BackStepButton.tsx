import { useNavigate } from "react-router-dom";

interface Props {
  onClick?: () => void;
}

function BackStepButton({ onClick }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="text-locker-blue w-full flex justify-center"
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          navigate(-1);
        }
      }}
    >
      <span>Quay trở lại</span>
    </div>
  );
}

export default BackStepButton;
