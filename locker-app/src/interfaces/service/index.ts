import type { Response } from "..";

export enum SERVICE_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export interface IServiceItem {
  id: number;
  name: string;
  unit: string;
  price: number;
  description: string;
  status?: SERVICE_STATUS;
  image: string;
}

export interface IService extends Response {
  items: IServiceItem[];
}
