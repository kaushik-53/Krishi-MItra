import { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
  timestamp: Timestamp;
  feedback?: 'positive' | 'negative';
}

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  messageCount: number;
}

export interface SuggestedQuestion {
  text: string;
  textHi: string;
  category: 'disease' | 'fertilizer' | 'weather' | 'market' | 'general';
}
