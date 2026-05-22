import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { ENV } from './env';

const firebaseConfig = {
  apiKey: ENV.firebase.apiKey,
  authDomain: ENV.firebase.authDomain,
  databaseURL: ENV.firebase.databaseURL,
  projectId: ENV.firebase.projectId,
  storageBucket: ENV.firebase.storageBucket,
  messagingSenderId: ENV.firebase.messagingSenderId,
  appId: ENV.firebase.appId,
  measurementId: ENV.firebase.measurementId,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = !!firebaseConfig.apiKey && firebaseConfig.apiKey !== 'your-api-key';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
} else {
  console.warn('Firebase not configured. Running in demo mode. Add VITE_FIREBASE_API_KEY to .env');
}

export { app, auth, db, storage, isFirebaseConfigured };
1