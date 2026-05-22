const getEnv = (key: string, fallback?: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value && fallback === undefined) {
    if (import.meta.env.DEV) {
      console.warn(`⚠️ Missing environment variable: ${key}`);
      return '';
    }
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? fallback ?? '';
};

const optionalEnv = (key: string, fallback: string = ''): string => {
  return (import.meta.env[key] as string | undefined) ?? fallback;
};

export const ENV = {
  firebase: {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: optionalEnv('VITE_FIREBASE_DATABASE_URL'),
    projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnv('VITE_FIREBASE_APP_ID'),
    measurementId: optionalEnv('VITE_FIREBASE_MEASUREMENT_ID'),
    vapidKey: optionalEnv('VITE_FIREBASE_VAPID_KEY'),
  },
  recaptcha: {
    siteKey: optionalEnv('VITE_RECAPTCHA_SITE_KEY'),
  },
  ai: {
    baseUrl: optionalEnv('VITE_AI_API_BASE_URL'),
    geminiKey: optionalEnv('VITE_GEMINI_API_KEY'),
    cloudVisionKey: optionalEnv('VITE_CLOUD_VISION_API_KEY'),
  },
  weather: {
    openWeatherKey: optionalEnv('VITE_OPENWEATHER_API_KEY'),
    imdKey: optionalEnv('VITE_IMD_API_KEY'),
  },
  market: {
    agmarknetKey: optionalEnv('VITE_AGMARKNET_API_KEY'),
    dataGovKey: optionalEnv('VITE_DATA_GOV_API_KEY'),
  },
  features: {
    voice: optionalEnv('VITE_ENABLE_VOICE', 'true') === 'true',
    marketPrediction: optionalEnv('VITE_ENABLE_MARKET_PREDICTION', 'true') === 'true',
    maintenanceMode: optionalEnv('VITE_MAINTENANCE_MODE', 'false') === 'true',
  },
  app: {
    name: optionalEnv('VITE_APP_NAME', 'Krishi Mitra'),
    env: optionalEnv('VITE_APP_ENV', 'development') as 'development' | 'staging' | 'production',
    isProd: optionalEnv('VITE_APP_ENV', 'development') === 'production',
    isDev: optionalEnv('VITE_APP_ENV', 'development') === 'development',
    sentryDsn: optionalEnv('VITE_SENTRY_DSN'),
  },
} as const;
