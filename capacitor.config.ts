import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tiens.sudan.app',
  appName: 'tiens-sudan',
  webDir: 'dist',
  plugins: {
    StatusBar: {
      hidden: true,
      overlaysWebView: true
    }
  }
};

export default config;
