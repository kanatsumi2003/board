import { ORDER_PAYMENT_METHOD } from "../order";

export enum ACCOUNT_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}

export enum ROLE {
  ADMIN = "Admin",
  STAFF = "Staff",
  CUSTOMER = "Customer",
}

export interface IAccountItem {
  id: number;
  username: string;
  phoneNumber: string;
  role: ROLE;
  status: ACCOUNT_STATUS;
  fullName?: string;
  description: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  wallet?: IWalletItem;
}

export interface IStaffItem extends IAccountItem {}
export interface ICustomerItem extends IAccountItem {}

export interface IWalletItem {
  id: number;
  balance: number;
  lastDepositAt: string;
}

export interface IWalletParam {
  phoneNumber: string;
  amount: number;
  method: ORDER_PAYMENT_METHOD;
}

export interface IStaffLoginRequest {
  username: string;
  password: string;
}
