import dayjs from "dayjs";

export const formatCurrency = (price: number): string =>
  price.toLocaleString("vi", { style: "currency", currency: "VND" });

export const formatDate = (date: string): string => {
  return dayjs(date).format("DD/MM/YYYY hh:mm:ss");
};
