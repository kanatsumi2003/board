/** user's device */
enum DeviceList {
  /** telephone */
  MOBILE = 'MOBILE',
  /** computer */
  DESKTOP = 'DESKTOP',
}

export interface IRangePicker {
  from?: string;
  to?: string;
}

export type Device = keyof typeof DeviceList;
