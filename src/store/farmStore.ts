import { create } from 'zustand';
import type { FarmDetails } from '@/types';

interface FarmStore {
  farmDetails: FarmDetails | null;
  isOnboarding: boolean;
  onboardingStep: number;
  setFarmDetails: (details: FarmDetails) => void;
  setOnboarding: (isOnboarding: boolean) => void;
  setOnboardingStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useFarmStore = create<FarmStore>((set) => ({
  farmDetails: null,
  isOnboarding: false,
  onboardingStep: 1,
  setFarmDetails: (farmDetails) => set({ farmDetails }),
  setOnboarding: (isOnboarding) => set({ isOnboarding }),
  setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
  nextStep: () => set((state) => ({ onboardingStep: Math.min(state.onboardingStep + 1, 4) })),
  prevStep: () => set((state) => ({ onboardingStep: Math.max(state.onboardingStep - 1, 1) })),
}));
