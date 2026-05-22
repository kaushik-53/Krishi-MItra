import { collection, addDoc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import type { DiseaseDetectionResult } from '@/types/disease.types';

export const diseaseService = {
  async saveDetection(data: Omit<DiseaseDetectionResult, 'id' | 'userId' | 'detectedAt'>) {
    const user = auth?.currentUser;
    if (!user || !db) {
      console.warn('User not authenticated or database not configured.');
      return null;
    }

    try {
      const docRef = await addDoc(collection(db, 'diseaseHistory', user.uid, 'records'), {
        ...data,
        userId: user.uid,
        detectedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error saving disease detection:', error);
      throw error;
    }
  },

  async getHistory(): Promise<DiseaseDetectionResult[]> {
    const user = auth?.currentUser;
    if (!user || !db) {
      console.warn('User not authenticated or database not configured.');
      return [];
    }

    try {
      const q = query(
        collection(db, 'diseaseHistory', user.uid, 'records'),
        orderBy('detectedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DiseaseDetectionResult[];
    } catch (error) {
      console.error('Error fetching disease detection history:', error);
      return [];
    }
  },
};
