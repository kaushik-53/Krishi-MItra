/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_DATABASE_URL: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  readonly VITE_FIREBASE_VAPID_KEY: string;
  readonly VITE_RECAPTCHA_SITE_KEY: string;
  readonly VITE_AI_API_BASE_URL: string;
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_CLOUD_VISION_API_KEY: string;
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_IMD_API_KEY: string;
  readonly VITE_AGMARKNET_API_KEY: string;
  readonly VITE_DATA_GOV_API_KEY: string;
  readonly VITE_ENABLE_VOICE: string;
  readonly VITE_ENABLE_MARKET_PREDICTION: string;
  readonly VITE_MAINTENANCE_MODE: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ENV: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
