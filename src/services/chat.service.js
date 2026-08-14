import { collection, doc, setDoc, getDocs, query, orderBy, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
export const chatService = {
    async saveSession(sessionId, messages, title) {
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
        }
        catch (error) {
            console.error('Error saving chat session:', error);
            throw error;
        }
    },
    async getSessions() {
        const user = auth?.currentUser;
        if (!user || !db) {
            console.warn('User not authenticated or database not configured.');
            return [];
        }
        try {
            const q = query(collection(db, 'chatSessions', user.uid, 'sessions'), orderBy('updatedAt', 'desc'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map((d) => {
                const data = d.data();
                return {
                    id: d.id,
                    title: data.title || 'Untitled Chat',
                    updatedAt: data.updatedAt,
                    messages: (data.messages || []).map((m) => ({
                        ...m,
                        timestamp: m.timestamp?.seconds ? new Date(m.timestamp.seconds * 1000) : new Date(m.timestamp)
                    }))
                };
            });
        }
        catch (error) {
            console.error('Error fetching chat sessions:', error);
            return [];
        }
    },
    async deleteSession(sessionId) {
        const user = auth?.currentUser;
        if (!user || !db) {
            console.warn('User not authenticated or database not configured.');
            return;
        }
        try {
            const sessionRef = doc(db, 'chatSessions', user.uid, 'sessions', sessionId);
            await deleteDoc(sessionRef);
        }
        catch (error) {
            console.error('Error deleting chat session:', error);
            throw error;
        }
    }
};
