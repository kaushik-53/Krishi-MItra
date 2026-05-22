export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'fruiting' | 'harvest';
export type BudgetPreference = 'low' | 'medium' | 'high';

export interface FertilizerInput {
  cropType: string;
  soilType: string;
  soilPh?: number;
  previousCrop?: string;
  growthStage: GrowthStage;
  irrigationType: string;
  landSizeAcres: number;
  budget: BudgetPreference;
}

export interface FertilizerRecommendation {
  id: string;
  npk: NPKRecommendation;
  micronutrients: MicronutrientSuggestion[];
  organicAlternatives: OrganicOption[];
  schedule: ApplicationSchedule[];
  estimatedCost: CostEstimate;
  subsidyInfo: SubsidyInfo[];
}

export interface NPKRecommendation {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  unit: string;
  perAcre: boolean;
}

export interface MicronutrientSuggestion {
  name: string;
  nameHi: string;
  amount: string;
  reason: string;
}

export interface OrganicOption {
  name: string;
  nameHi: string;
  ratio: string;
  applicationMethod: string;
}

export interface ApplicationSchedule {
  week: number;
  fertilizer: string;
  amount: string;
  method: string;
  notes: string;
}

export interface CostEstimate {
  totalCost: number;
  breakdown: { item: string; cost: number }[];
  currency: string;
}

export interface SubsidyInfo {
  schemeName: string;
  schemeNameHi: string;
  eligibility: string;
  benefit: string;
  link: string;
}
