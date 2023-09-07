import type { Auditable } from "..";
import { ORDER_PAYMENT_METHOD } from "../order";

export interface IBillItem extends Auditable {
  id: number;
  referenceOrderId: number;
  amount: number;
  method: ORDER_PAYMENT_METHOD;
  content: string;
  referenceTransactionId: string;
}
