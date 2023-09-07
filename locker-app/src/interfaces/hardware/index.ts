import type { Response } from '..';

export interface IHardwareItem {
  id: number;
  name: string;
  code: string;
  brand: string;
  price: number;
  description: string;
}

export interface IHardware extends Response {
  items: IHardwareItem[];
}
