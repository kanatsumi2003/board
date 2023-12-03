import type { IPaging, Response } from "..";
import { IAccountItem } from "../account";
import { IBoxItem } from "../box";
import type { ILockerItem } from "../locker";
import { IServiceItem } from "../service";

export enum ORDER_STATUS {
  INITIALIZED = "Initialized",
  WAITING = "Waiting",
  PROCESSING = "Processing",
  PROCESSED = "Processed",
  RETURNED = "Returned",
  COMPLETED = "Completed",
  CANCELED = "Canceled",
  OVERTIME = "Overtime",
  RESERVED = "Reserved",
}
export enum ORDER_TYPE {
  STORAGE = "Storage",
  LAUNDRY = "Laundry",
}
export enum ORDER_PAYMENT_METHOD {
  VN_PAY = "VnPay",
  MOMO = "Momo",
}

export enum ORDER_PAYMENT_STATUS {
  CREATED = "Created",
  PROCESSING = "Processing",
  FAILED = "Failed",
  COMPLETED = "Completed",
}

export interface ITimeLineItem {
  id: number;
  status: ORDER_STATUS;
  previousStatus: ORDER_STATUS;
  time: string;
}

export interface IOrderDetailItem {
  id: number;
  type: ORDER_TYPE;
  pinCode: string;
  pinCodeIssuedAt: string;
  sendBox: IBoxItem;
  receiveBox: IBoxItem;
  receiveAt: string;
  status: ORDER_STATUS;
  locker: ILockerItem;
  price: number;
  extraCount: number;
  extraFee: number;
  discount: number;
  description: string;
  reservationFee: number;
  totalExtraFee: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  sender: IAccountItem;
  receiver: IAccountItem;
  details: IDetailItem[];
}

export interface IDetailItem {
  id: number;
  service: IServiceItem;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IOrderItem {
  id: 0;
  pinCode: string;
  pinCodeIssuedAt: string;
  sender: IAccountItem;
  receiver: IAccountItem;
}
export interface IOrder extends Response {
  items: IOrderDetailItem[];
}

export interface ICreateOrderRequest {
  lockerId: number;
  senderPhone?: string;
  intendedReceiveAt?: string;
  customerNote?: string;
  receiverPhone?: string;
  type?: ORDER_TYPE;
  deliveryAddress?: {
    address?: string;
    wardCode?: string;
    ward?: string;
    districtCode?: string;
    district?: string;
    provinceCode?: string;
    province?: string;
    longitude?: number;
    latitude?: number;
  };
  details?: IOrderServiceItem[];
}

export interface IOrderServiceItem extends IServiceItem {
  serviceId: number;
  quantity: number;
}

export interface ICheckOutOrderRequest {
  method: ORDER_PAYMENT_METHOD;
}

export interface IUpdateOrderRequest {
  amount: number;
  fee: number;
}

export interface IOrdersParams extends Partial<IPaging> {
  type?: ORDER_TYPE;
  status?: ORDER_STATUS;
  deliverySupported?: boolean;
  lockerId?: number;
}
