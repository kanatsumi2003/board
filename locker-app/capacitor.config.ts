import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.amazing.locker",
  appName: "locker",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
