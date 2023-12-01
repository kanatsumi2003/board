import { ORDER_TYPE } from "@/interfaces/order";

export const renderOrderTypeColor = (type: ORDER_TYPE) => {
  switch (type) {
    case ORDER_TYPE.LAUNDRY: {
      return "#00A3E0";
    }
    case ORDER_TYPE.STORAGE: {
      return "#9DC63F";
    }
  }
};

export const renderOrderTypeText = (type: ORDER_TYPE) => {
  switch (type) {
    case ORDER_TYPE.LAUNDRY: {
      return "Giặt sấy";
    }
    case ORDER_TYPE.STORAGE: {
      return "Giữ đồ";
    }
  }
};
