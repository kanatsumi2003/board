import { IAuditable } from "..";
import { ORDER_PAYMENT_METHOD, ORDER_PAYMENT_STATUS } from "../order";

export interface IPaymentItem extends IAuditable {
  id: number;
  amount: number;
  method: ORDER_PAYMENT_METHOD;
  content: string;
  referenceTransactionId: string;
  qr: string;
  url: string;
  orderId: number;
  customerId: number;
  status: ORDER_PAYMENT_STATUS;
}
