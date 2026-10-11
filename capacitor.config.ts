import type { CapacitorConfig } from "@capacitor/cli";
const config: CapacitorConfig = {
  appId: "com.paliaapkhub.promptmaker",
  appName: "Prompt Maker",
  webDir: "out",
  backgroundColor: "#fbfdfc",
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      launchAutoHide: true,
      backgroundColor: "#fbfdfc",
      androidScaleType: "FIT_CENTER",
      showSpinner: false,
      splashImmersive: false
    },
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#fbfdfc",
      style: "LIGHT"
    }
  },
  server: { androidScheme: "https" }
};
export default config;
