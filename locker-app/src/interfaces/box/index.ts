import { IOrderDetailItem } from "../order";

export enum BOX_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  WAITING = "Waiting",
}

export interface IBoxItem {
  id: number;
  number: number;
  pinNo: number;
  isActive: boolean;
  lockerId: number;
  lastOrder: IOrderDetailItem;
  isAvailable: true;
}
