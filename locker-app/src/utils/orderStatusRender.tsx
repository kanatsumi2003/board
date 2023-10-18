import { ORDER_STATUS } from "@/interfaces/order";

interface StatusTagProps {
  children: string;
  className: string;
}
const StatusTag = ({ children, className }: StatusTagProps) => {
  return (
    <div className={`${className} h-min px-6 py-2.5 rounded-3xl text-white`}>
      {children}
    </div>
  );
};

export const renderOrderStatusTag = (status: ORDER_STATUS) => {
  switch (status) {
    case ORDER_STATUS.WAITING: {
      return <StatusTag className="bg-locker-blue">Đang chờ</StatusTag>;
    }
    case ORDER_STATUS.PROCESSED: {
      return <StatusTag className="bg-locker-green">Hoàn tất xử lý</StatusTag>;
    }
  }
};
