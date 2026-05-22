import { Timestamp, GeoPoint } from 'firebase/firestore';

export type UserRole = 'farmer' | 'extension_worker' | 'admin';
export type Language = 'en' | 'hi';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'black' | 'red' | 'laterite';
export type IrrigationType = 'drip' | 'flood' | 'rainfed' | 'sprinkler' | 'canal';

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  phone: string;
  photoURL: string;
  role: UserRole;
  createdAt: Timestamp;
  lastActive: Timestamp;
  language: Language;
  onboardingComplete: boolean;
  fcmToken: string;
  farm: FarmDetails;
}

export interface FarmDetails {
  state: string;
  district: string;
  taluka: string;
  landSizeAcres: number;
  soilType: SoilType;
  irrigationType: IrrigationType;
  primaryCrop: string;
  secondaryCrops: string[];
  geoCoordinates: GeoPoint | null;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
