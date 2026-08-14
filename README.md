<div align="center">

# 🌾 Krishi Mitra
### *The New Path for Farming*

**AI-powered digital companion for 150M+ Indian farmers**  
Crop disease detection · Smart fertilizer guidance · Live weather advisories · Market price insights · Voice & chat AI support

---

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
[![CSS3](https://img.shields.io/badge/CSS3-Vanilla-1572B6?style=flat-square&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/)
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_2.0_Flash-AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## 🚀 The Problem We're Solving

India has **150+ million farmers** — yet most still rely on guesswork for disease diagnosis, fertilizer choices, and market timing. Language barriers, lack of internet literacy, and sparse agricultural extension services leave millions of farmers underserved.

**Krishi Mitra** bridges this gap with AI, putting a knowledgeable farming advisor directly in every farmer's pocket — in **Hindi and English**, usable even with voice commands.

---

## ✨ Key Features

### 🦠 AI Crop Disease Detection
Upload a photo of your crop leaf and get an instant AI diagnosis — disease name, confidence score, organic & chemical treatment plans, and prevention tips. Powered by a local **PyTorch (EfficientNet-B0)** image classifier with a seamless client-side simulation fallback in case the service is offline or blocked.

### 🌤️ Hyper-Local Weather Advisory
Real-time weather data with farm-specific recommendations: irrigation advice, spray schedules, frost warnings, and a 7-day farming calendar.

### 🧪 Smart Fertilizer Guidance
Input your crop type, soil type, and growth stage — get precise NPK & micronutrient recommendations with estimated costs and government subsidy info.

### 📈 Live Market Prices
Track live mandi prices across states, view price trend charts, get AI-powered best-time-to-sell advice, and set custom price alerts.

### 🤖 AI Chatbot (Hindi + English)
Ask any farming question and get expert answers powered by **Gemini 2.0 Flash**. Supports both Hindi and English naturally. Chat history saved to the cloud.

### 🎙️ Voice Assistant
Completely hands-free farming advice. Speak in Hindi or English → get AI response → hear it spoken back. Powered by Web Speech API + Gemini AI.

### 🔐 Secure Authentication
Email/password login, Google Sign-In, forgot password (email reset), and Firebase-backed user profiles.

### 📱 Progressive Web App
Install on Android or desktop for an app-like experience. Optimized for low-bandwidth rural connectivity.

### 🌐 Full Bilingual Support
Complete Hindi (`hi`) and English (`en`) UI — every screen, label, toast, and AI response. Includes a customizable Floating Guide.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 18 (JavaScript ES6+) |
| **Build Tool** | Vite 8 |
| **Styling** | Vanilla CSS (Modular Component Styles + Custom Animations & Global Design Tokens) |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **Server State** | TanStack React Query |
| **Forms & Validation** | React Hook Form + Zod |
| **Routing** | React Router DOM v6 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **AI / LLM** | Google Gemini 2.0 Flash |
| **Auth** | Firebase Authentication |
| **Database** | Cloud Firestore |
| **Storage** | Firebase Storage |
| **i18n** | i18next + react-i18next |
| **PWA** | vite-plugin-pwa |
| **Notifications** | react-hot-toast |
| **Backend API** | FastAPI (Python 3.10+) |
| **Machine Learning** | PyTorch (EfficientNet-B0) |

---

## 📁 Project Structure

```
krishi-mitra/
├── src/
│   ├── components/             # Shared UI components & layouts
│   │   ├── common/             # Language switcher, loaders
│   │   ├── layout/             # Navbar, footer
│   │   └── ui/                 # Scoped components (Button, Card, Modal, etc.)
│   ├── pages/
│   │   ├── AIChatbot/          # Gemini-powered chat with history
│   │   ├── AuthPage/           # Login, register, forgot password
│   │   ├── Dashboard/          # Personalized farm dashboard
│   │   ├── DiseaseDetection/   # Crop photo upload + AI diagnosis
│   │   ├── FarmProfile/        # Farmer profile management
│   │   ├── FertilizerRecommendation/  # NPK & input advisor
│   │   ├── LandingPage/        # Public marketing page
│   │   ├── MarketPrediction/   # Mandi prices + trends
│   │   ├── Notifications/      # Alerts & reminders
│   │   ├── VoiceAssistant/     # Speech-to-text + AI + TTS
│   │   └── WeatherAdvisory/    # Real-time weather + farm advice
│   ├── services/
│   │   ├── ai.service.js       # Gemini API & offline ML simulator fallback
│   │   ├── auth.service.js     # Firebase Auth helpers
│   │   ├── chat.service.js     # Firestore chat persistence
│   │   ├── disease.service.js  # Disease detection API client
│   │   ├── market.service.js   # Market data API
│   │   └── weather.service.js  # OpenWeather integration
│   ├── styles/                 # global.css & custom animations.css
│   ├── config/                 # Firebase & environment config
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities, validators, animations
│   ├── locales/                # en.json & hi.json translations
│   └── store/                  # Zustand state stores
├── backend/                    # Python FastAPI backend
│   ├── weights/                # Trained PyTorch weights (.pth)
│   ├── main.py                 # FastAPI endpoints & CORS config
│   └── inference.py            # PyTorch model load, transforms, & predictor
├── public/                     # Static assets & PWA icons
└── firebase.json               # Firebase deploy configuration
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+ (for local AI/ML disease detection service)
- A [Firebase project](https://console.firebase.google.com/) with **Authentication** and **Firestore** enabled
- A [Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)
- An [OpenWeatherMap API key](https://openweathermap.org/api) (free tier)

---

### Setup Instructions

#### 1. Clone the repository
```bash
git clone https://github.com/kaushik-53/Krishi-MItra.git
cd Krishi-MItra
```

#### 2. Configure Environment Variables
Create a `.env` file in the root directory by copying the template:
```bash
cp .env.example .env
```
Fill in your API keys and Firebase configurations:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI/ML Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_AI_API_BASE_URL=http://localhost:8000

# Weather API
VITE_OPENWEATHER_API_KEY=your_openweather_key

# Market Data API
VITE_DATA_GOV_API_KEY=your_data_gov_key
```

In the [Firebase Console](https://console.firebase.google.com/):
- Enable **Email/Password** and **Google** sign-in under **Authentication → Sign-in method**
- Create a **Firestore** database
- Add `localhost` and your hosted domains under **Authentication → Settings → Authorized domains**

---

#### 3. Run the Frontend (React Client)
Install the frontend node packages and launch Vite:
```bash
# Install NPM packages
npm install

# Start the local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

#### 4. Run the Backend (PyTorch ML Service)
Create a Python virtual environment and run the FastAPI server:
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Mac/Linux:
source .venv/bin/activate

# Install required Python dependencies
pip install -r requirements.txt

# Start the Python FastAPI server
python main.py
```
The ML server runs on **`http://localhost:8000`** and will be queried by your React frontend for leaf crop disease detection. 

*If the backend is not running or is blocked by browser security (e.g., HTTPS Mixed Content on your deployed site), the frontend will automatically invoke a simulated local prediction fallback.*

---

## 📜 Available Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start local development server |
| `npm run build` | Compile code for production (output to `dist/`) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create a feature branch** — `git checkout -b feature/your-feature`
3. **Commit your changes** — `git commit -m "feat: add your feature"`
4. **Push to your branch** — `git push origin feature/your-feature`
5. **Open a Pull Request** 🎉

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ for the farmers of India 🇮🇳

*Krishi Mitra — because every farmer deserves a knowledgeable friend.*

</div>
