import { Timestamp } from 'firebase/firestore';

export interface MandiPrice {
  id: string;
  commodity: string;
  commodityHi: string;
  variety: string;
  state: string;
  district: string;
  market: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  unit: string;
  arrivalDate: string;
  arrivalQuantity: number;
}

export interface PriceTrend {
  date: string;
  price: number;
  volume: number;
}

export interface PricePrediction {
  crop: string;
  currentPrice: number;
  predictedPrice7d: number;
  predictedPrice30d: number;
  confidence: number;
  recommendation: 'sell_now' | 'hold' | 'wait';
  reasoning: string;
  reasoningHi: string;
  factors: PredictionFactor[];
}

export interface PredictionFactor {
  name: string;
  impact: 'positive' | 'negative' | 'neutral';
  weight: number;
  description: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  commodity: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Timestamp;
  triggeredAt: Timestamp | null;
}

export interface NearbyMandi {
  name: string;
  district: string;
  distance: number;
  currentPrice: number;
  transportCost: number;
  netPrice: number;
}
