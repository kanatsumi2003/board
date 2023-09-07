import { IAuditable, IPaging } from "..";
import type { IHardwareItem } from "../hardware";
import type { IServiceItem } from "../service";
import { IStoreItem } from "../store";

export enum LOCKER_STATUS {
  INITIALIZED = "Initialized",
  ACTIVE = "Active",
  INACTIVE = "Inactive",
  MAINTAINING = "Maintaining",
}

export enum LOCKER_EVENT {
  CONNECT = "Connect",
  UPDATE_STATUS = "UpdateStatus",
  UPDATE_INFORMATION = "UpdateInformation",
  OVERLOAD = "Overload",
}

export interface ILockerItem extends IAuditable {
  id: number;
  name: string;
  code: string;
  image: string;
  status: LOCKER_STATUS;
  location: ILocation;
  description: string;
  store: IStoreItem;
  macAddress: string;
  ipAddress: string;
}

export interface ILocker extends Response {
  items: ILocker[];
}

export interface ILockerParams extends IPaging {
  name: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
}

export interface ILockerBody extends ILockerItem {
  hardwares: IHardwareItem[];
  services: IServiceItem[];
}

export interface IAddress {
  code: string;
  name: string;
  parentCode: string;
}

export interface IAddressResponse {
  items: IAddress[];
}

export interface ILocation {
  id: number;
  address: string;
  longitude: number;
  latitude: number;
  description: string;
  province: IAddress;
  district: IAddress;
  ward: IAddress;
}

export interface ILockerTimelineItem {
  event: LOCKER_EVENT;
  status: LOCKER_STATUS;
  previousStatus: LOCKER_STATUS;
  description: string;
  errorCode: number;
  error: string;
  time: string;
}

export interface ILockerTimelineResponse extends Response {
  items: ILockerTimelineItem[];
}

export interface ILockerTimelineParams extends IPaging {
  from: string;
  to: string;
  event: LOCKER_EVENT;
}

export interface ILockerInfoResponse {
  locker_id: string;
  locker_code: string;
  locker_name: string;
  locker_status: LOCKER_STATUS;
  api_host: string;
  api_key: string;
}

export interface ILockerInfoItem {
  id: number;
  code: string;
  name: string;
  status: LOCKER_STATUS;
  apiHost: string;
  apiKey: string;
}

export interface ICheckBoxesResponse {
  closed: boolean;
}
