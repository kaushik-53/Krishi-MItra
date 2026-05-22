# Krishi Mitra

> AI-powered digital assistant for Indian farmers — crop disease detection, fertilizer guidance, weather advisories, market insights, and conversational support.


## Why Krishi Mitra?

`Krishi Mitra` brings modern agricultural support to the farmer's palm with a mobile-first dashboard, intelligent crop diagnostics, and farm-specific recommendations.


## Core Features

- ✅ Image-based crop disease detection with AI-powered analysis
- ✅ Smart fertilizer recommendation and crop input guidance
- ✅ Real-time weather advisories and climate-driven recommendations
- ✅ Market price tracking and regional price visualization
- ✅ Hindi + English conversational AI chatbot for farming questions
- ✅ Voice assistant access for hands-free interaction
- ✅ Farm profile management and personalized experience
- ✅ Firebase authentication, Firestore history, and image storage
- ✅ Progressive Web App (PWA) support for offline-ready behavior
- ✅ Full internationalization with English and Hindi support


## Tech Stack

- Frontend: `React` + `TypeScript`
- Bundler: `Vite`
- Styling: `Tailwind CSS`
- State management: `zustand`, `@tanstack/react-query`
- Forms & validation: `react-hook-form`, `zod`
- Routing: `react-router-dom`
- Animations: `framer-motion`
- Charts: `recharts`
- Icons: `lucide-react`
- Firebase: `firebase/auth`, `firebase/firestore`, `firebase/storage`
- PWA support: `vite-plugin-pwa`
- i18n: `i18next`, `react-i18next`


## Project Structure

- `src/pages/` — Feature pages like `AIChatbot`, `DiseaseDetection`, `WeatherAdvisory`, `FertilizerRecommendation`, `MarketPrediction`, `VoiceAssistant`, and `FarmProfile`
- `src/services/` — API and business logic for AI, weather, market, disease, and auth
- `src/config/` — environment and Firebase configuration
- `src/components/` — shared layout and UI components
- `src/store/` — app state management with Zustand
- `src/types/` — shared TypeScript interfaces and models


## Getting Started

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file at the project root

```bash
copy .env.example .env
```

3. Add required environment variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_OPENWEATHER_API_KEY=
VITE_DATA_GOV_API_KEY=

VITE_ENABLE_VOICE=true
VITE_ENABLE_MARKET_PREDICTION=true
```

4. Run the app

```bash
npm run dev
```


## Available Scripts

- `npm run dev` — start the local development server
- `npm run build` — compile TypeScript and build production assets
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint checks


## Environment Variables

The app relies on runtime environment variables defined in `src/config/env.ts`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_OPENWEATHER_API_KEY`
- `VITE_DATA_GOV_API_KEY`
- `VITE_ENABLE_VOICE`
- `VITE_ENABLE_MARKET_PREDICTION`


## Notes

- Firebase provides authentication, Firestore persistence, and upload storage.
- Weather advisories are generated using live weather data and custom decision rules.
- Disease detection is enabled through crop image upload and AI response parsing.
- The app supports both English and Hindi user experiences.


## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add ..."`
4. Push and open a pull request


## License

No license is specified in this repository. Add one if you want to make the project open source.
