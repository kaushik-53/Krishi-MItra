import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
const googleProvider = new GoogleAuthProvider();
export const authService = {
    async loginWithEmail(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    },
    async registerWithEmail(email, password, name) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
            displayName: name, email, phone: '', photoURL: '', role: 'farmer',
            createdAt: Timestamp.now(), lastActive: Timestamp.now(),
            language: 'en', onboardingComplete: false, fcmToken: '',
        });
        return result;
    },
    async loginWithGoogle() {
        const result = await signInWithPopup(auth, googleProvider);
        const userDoc = await getDoc(doc(db, 'users', result.user.uid));
        if (!userDoc.exists()) {
            await setDoc(doc(db, 'users', result.user.uid), {
                displayName: result.user.displayName || '', email: result.user.email || '',
                phone: result.user.phoneNumber || '', photoURL: result.user.photoURL || '',
                role: 'farmer', createdAt: Timestamp.now(), lastActive: Timestamp.now(),
                language: 'en', onboardingComplete: false, fcmToken: '',
            });
        }
        return result;
    },
    async logout() { return signOut(auth); },
    async resetPassword(email) { return sendPasswordResetEmail(auth, email); },
    async getUserProfile(uid) {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? { uid, ...snap.data() } : null;
    },
    async updateProfile(uid, data) {
        return updateDoc(doc(db, 'users', uid), { ...data, lastActive: Timestamp.now() });
    },
};
