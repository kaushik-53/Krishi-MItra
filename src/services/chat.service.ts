import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: any;
  feedback?: 'positive' | 'negative';
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: any;
  messages: ChatMessage[];
}

export const chatService = {
  async saveSession(sessionId: string, messages: ChatMessage[], title: string) {
    const user = auth?.currentUser;
    if (!user || !db) {
      console.warn('User not authenticated or database not configured.');
      return null;
    }

    try {
      const sessionRef = doc(db, 'chatSessions', user.uid, 'sessions', sessionId);
      await setDoc(sessionRef, {
        id: sessionId,
        title,
        updatedAt: Timestamp.now(),
        messages: messages.map(m => ({
          ...m,
          timestamp: m.timestamp instanceof Date ? Timestamp.fromDate(m.timestamp) : m.timestamp
        }))
      }, { merge: true });
      return sessionId;
    } catch (error) {
      console.error('Error saving chat session:', error);
      throw error;
    }
  },

  async getSessions(): Promise<ChatSession[]> {
    const user = auth?.currentUser;
    if (!user || !db) {
      console.warn('User not authenticated or database not configured.');
      return [];
    }

    try {
      const q = query(
        collection(db, 'chatSessions', user.uid, 'sessions'),
        orderBy('updatedAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.title || 'Untitled Chat',
          updatedAt: data.updatedAt,
          messages: (data.messages || []).map((m: any) => ({
            ...m,
            timestamp: m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000) : new Date(m.timestamp)
          }))
        };
      }) as ChatSession[];
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      return [];
    }
  },

  async deleteSession(sessionId: string) {
    const user = auth?.currentUser;
    if (!user || !db) {
      console.warn('User not authenticated or database not configured.');
      return;
    }

    try {
      const sessionRef = doc(db, 'chatSessions', user.uid, 'sessions', sessionId);
      await deleteDoc(sessionRef);
    } catch (error) {
      console.error('Error deleting chat session:', error);
      throw error;
    }
  }
};
