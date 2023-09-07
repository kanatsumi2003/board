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
}

export interface IStaffItem extends IAccountItem {}
export interface ICustomerItem extends IAccountItem {}
export interface IStaffLoginRequest {
  phoneNumber: string;
  password: string;
}
