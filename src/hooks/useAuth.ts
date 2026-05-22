import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '@/config/firebase';
import { useAuthStore } from '@/store/authStore';
import type { UserProfile } from '@/types';

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setLoading, setError } = useAuthStore();

  useEffect(() => {
    // Skip auth listener if Firebase is not configured (demo mode)
    if (!isFirebaseConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        try {
          if (db) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
              setUser({ uid: firebaseUser.uid, ...userDoc.data() } as UserProfile);
            } else {
              setUser({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName || '',
                email: firebaseUser.email || '',
                phone: firebaseUser.phoneNumber || '',
                photoURL: firebaseUser.photoURL || '',
                role: 'farmer',
                onboardingComplete: false,
                language: 'en',
              } as UserProfile);
            }
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user data');
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setError]);

  return { user, isAuthenticated, isLoading };
}
