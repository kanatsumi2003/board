import { AiOutlineClose } from "react-icons/ai";

interface Props {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
  onOk?: () => void;
}

export function Modal({ className, children, onClose, onOk }: Props) {
  return (
    <div className="transition-all fixed bottom-0 top-0 left-0 right-0 z-50 flex justify-center items-center overflow-x-hidden overflow-y-auto max-h-full bg-gray-400 bg-opacity-60">
      <div className="relative bg-white rounded-xl shadow p-4 px-20">
        <button
          type="button"
          className="absolute top-4 right-4 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 ml-auto inline-flex justify-center items-center"
          onClick={onClose}
        >
          <AiOutlineClose className="text-3xl" />
          <span className="sr-only">Close modal</span>
        </button>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
}
