import dayjs from "dayjs";

export const formatCurrency = (price: number): string =>
  price.toLocaleString("vi", { style: "currency", currency: "VND" });

export const formatThousandNumber = (value: string | number | undefined) => {
  return value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";
};

export const formatDate = (date?: string): string => {
  if (!date) {
    return "";
  }
  return dayjs(date).format("DD/MM/YYYY HH:mm:ss");
};
