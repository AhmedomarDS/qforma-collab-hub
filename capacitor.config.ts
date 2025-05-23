
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.qforma.collab.hub',
  appName: 'QForma SDLC Hub',
  webDir: 'dist',
  server: {
    url: 'https://c3cf9b27-cb6c-4d62-af59-823dd8ade157.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  },
  ios: {
    contentInset: 'automatic',
    scrollEnabled: true
  }
};

export default config;
