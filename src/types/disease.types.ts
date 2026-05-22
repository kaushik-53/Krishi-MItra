import { Timestamp } from 'firebase/firestore';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface DiseaseDetectionResult {
  id: string;
  userId: string;
  imageUrl: string;
  imageUrls: string[];
  diseaseName: string;
  diseaseNameHi: string;
  confidence: number;
  severity: Severity;
  description: string;
  descriptionHi: string;
  treatments: Treatment[];
  preventionTips: string[];
  preventionTipsHi: string[];
  cropType: string;
  detectedAt: Timestamp;
}

export interface Treatment {
  type: 'organic' | 'chemical';
  name: string;
  nameHi: string;
  dosage: string;
  application: string;
  applicationHi: string;
  precautions: string[];
}
