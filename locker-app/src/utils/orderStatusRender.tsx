import { ORDER_STATUS } from "@/interfaces/order";

interface StatusTagProps {
  children: React.ReactNode;
  color?: string;
}
const StatusTag = ({ children, color }: StatusTagProps) => {
  return (
    <div
      className={`h-min px-6 py-2.5 rounded-3xl text-white text-center`}
      style={{ backgroundColor: color }}
    >
      {children}
    </div>
  );
};

export const renderOrderStatusTag = (status: ORDER_STATUS) => {
  return (
    <StatusTag color={renderOrderStatusColor(status)}>
      <>{renderOrderStatus(status)}</>
    </StatusTag>
  );
};

export const renderOrderStatus = (status: ORDER_STATUS) => {
  switch (status) {
    case ORDER_STATUS.WAITING: {
      return "Đang chờ";
    }
    case ORDER_STATUS.PROCESSED: {
      return "Hoàn tất xử lý";
    }
    case ORDER_STATUS.OVERTIME: {
      return "Quá hạn";
    }
    case ORDER_STATUS.RESERVED: {
      return "Đã đặt trước";
    }
  }
};

export const renderOrderStatusColor = (status: ORDER_STATUS) => {
  switch (status) {
    case ORDER_STATUS.WAITING: {
      return "#00A3E0";
    }
    case ORDER_STATUS.PROCESSED: {
      return "#9DC63F";
    }
    case ORDER_STATUS.OVERTIME: {
      return "#EAB763";
    }
  }
};

export const renderProcessOrderText = (status: ORDER_STATUS) => {
  switch (status) {
    case ORDER_STATUS.WAITING: {
      return "Đơn hàng cần được xử lý";
    }
    case ORDER_STATUS.PROCESSED: {
      return "Hoàn tất xử lý";
    }
    case ORDER_STATUS.RESERVED: {
      return "Đơn hàng đã được đặt chỗ";
    }
    case ORDER_STATUS.OVERTIME: {
      return "Đơn hàng quá hạn";
    }
  }
};
