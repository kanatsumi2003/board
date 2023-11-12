export enum TOKEN_TYPE {
  OTP = "Otp",
  DEVICE_TOKEN = "DeviceToken",
  RESET_PASSWORD = "ResetPassword",
  OTHER = "Other",
}

export enum TOKEN_STATUS {
  VALID = "valid",
  INVALID = "Invalid",
}

export enum DEVICE_TYPE {
  ANDROID = "Android",
  IOS = "Ios",
}

export interface ITokenItem {
  id: number;
  accountId: number;
  type: TOKEN_TYPE;
  status: TOKEN_STATUS;
  value: string;
  expiredAt: string;
  isExpired: boolean;
  deviceType: DEVICE_TYPE;
}
