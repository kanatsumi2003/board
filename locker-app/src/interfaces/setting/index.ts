import { ITime } from "..";

export enum SERVICE_STATUS {
  ACTIVE = "Active",
  INACTIVE = "Inactive",
}
export interface ISettingItem {
  informationSettings: {
    companyName: string;
    contactPhone: string;
    contactEmail: string;
    facebook: string;
    zalo: string;
    openedAt: ITime;
    closedAt: ITime;
  };
  accountSettings: {
    maxWrongLoginCount: number;
    wrongLoginBlockTimeInMinutes: number;
  };
  orderSettings: {
    initTimeoutInMinutes: number;
    reservationInitTimeoutInMinutes: number;
    storagePrice: number;
    maxTimeInHours: number;
    extraFee: number;
    maxActiveOrderCount: number;
  };
  zaloAuthSettings: {
    accessToken: string;
    refreshToken: string;
  };
  timeSettings: {
    timeZone: string;
  };
}
