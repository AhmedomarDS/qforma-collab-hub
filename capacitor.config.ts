
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.c3cf9b27cb6c4d62af59823dd8ade157',
  appName: 'qforma-collab-hub',
  webDir: 'dist',
  server: {
    url: 'https://c3cf9b27-cb6c-4d62-af59-823dd8ade157.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e40af',
      showSpinner: true,
      spinnerColor: '#ffffff'
    }
  }
};

export default config;
