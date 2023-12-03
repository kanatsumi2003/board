export interface PageData<T> {
  pageNum: number;
  pageSize: number;
  total: number;
  data: T[];
}

export interface Response {
  pageNumber: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: unknown;
}

export interface IPaging {
  pageNumber: number;
  pageSize: number;
  sortColumn: string;
  sortDir?: "Asc" | "Desc";
}

export interface IAuditable {
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  deletedAt?: string;
  deletedBy?: number;
  createdByUsername?: string;
  updatedByUsername?: string;
  deletedByUsername?: string;
  deleted?: boolean;
}

export interface ITime {
  ticks: number;
  days: number;
  hours: number;
  milliseconds: number;
  microseconds: number;
  nanoseconds: number;
  minutes: number;
  seconds: number;
  totalDays: number;
  totalHours: number;
  totalMilliseconds: number;
  totalMicroseconds: number;
  totalNanoseconds: number;
  totalMinutes: number;
  totalSeconds: number;
}

export interface ILocation {
  province?: string;
  provinceCode?: string;
  district?: string;
  districtCode?: string;
  ward?: string;
  wardCode?: string;
  longitude?: number;
  latitude?: number;
}

export interface IAddress {
  address: string;
  wardCode: string;
  districtCode: string;
  provinceCode: string;
  longitude: number;
  latitude: number;
}
