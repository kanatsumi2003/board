import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode | string;
  icon?: React.ReactNode | string;
  to?: string;
  small?: boolean;
  onClick?: () => void;
  type: "primary" | "secondary" | "disabled" | "warning";
  className?: string;
  wrapperClassName?: string;
}

function Button({
  children,
  to,
  small,
  onClick,
  type,
  className,
  icon,
  wrapperClassName,
}: Props) {
  return (
    <Link to={to ?? ""} className={wrapperClassName}>
      <div
        onClick={(e) => {
          if (type !== "disabled") {
            if (onClick) {
              e.preventDefault();
              onClick();
            }
          } else {
            e.preventDefault();
          }
        }}
        className={`text-4xl overflow-hidden button flex justify-center gap-4 ${(() => {
          switch (type) {
            case "warning": {
              return "bg-locker-yellow ring-locker-yellow border-locker-yellow";
            }
            case "primary": {
              return "bg-locker-blue ring-locker-blue border-locker-blue";
            }
            case "secondary": {
              return "bg-locker-green ring-locker-green border-locker-green";
            }

            case "disabled": {
              return "bg-gray-500 ring-gray-500 border-gray-500 cursor-not-allowed";
            }
          }
        })()} rounded-2xl ${
          small ? "py-4 px-12 min-w-[200px]" : "p-12"
        } text-center hover:bg-opacity-80 box-border relative z-30 inline-flex items-center justify-center w-full font-bold text-white transition-all duration-300 cursor-pointer group border-2 ease focus:outline-none ${className}`}
      >
        {small ? (
          <>
            <span className="absolute bottom-0 right-0 w-12 h-20 -mb-8 -mr-8 transition-all duration-300 ease-out transform rotate-45 translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 -left-4 w-20 h-12 -mt-6 -ml-6 transition-all duration-300 ease-out transform -rotate-45 -translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
          </>
        ) : (
          <>
            <span className="absolute bottom-0 right-0 w-24 h-40 -mb-16 -mr-8 transition-all duration-300 ease-out transform rotate-45 translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
            <span className="absolute top-0 left-2 w-40 h-24 -mt-6 -ml-24 transition-all duration-300 ease-out transform -rotate-45 -translate-x-2 bg-white opacity-10 group-hover:translate-x-0"></span>
          </>
        )}
        <span className="relative z-20 flex items-center gap-4">
          {icon}
          {children}
        </span>
      </div>
    </Link>
  );
}

export default Button;
