import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
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
let app = null;
let auth = null;
let db = null;
let storage = null;
if (isFirebaseConfigured) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);
    }
    catch (error) {
        console.warn('Firebase initialization failed:', error);
    }
}
else {
    console.warn('Firebase not configured. Running in demo mode. Add VITE_FIREBASE_API_KEY to .env');
}
export { app, auth, db, storage, isFirebaseConfigured };
1;
