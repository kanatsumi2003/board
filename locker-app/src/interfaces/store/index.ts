import { ILocation } from "../locker";

export enum STORE_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export interface IStoreItem {
  id: number;
  name: string;
  contactPhone: string;
  status: STORE_STATUS;
  location: ILocation;
  image: string;
}
