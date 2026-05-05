import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          // Proxy /admin/* to live admin backend so session cookies stay
          // same-origin (localhost:3010) and Flask-Login sessions work in dev.
          '/admin': {
            changeOrigin: true,
            target: 'http://pyrfwdlvdkkumb46xfx4dwb8.77.42.71.248.sslip.io',
            ws: true,
          },
        },
      },
    },
  };
});
