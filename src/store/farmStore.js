import { create } from 'zustand';
export const useFarmStore = create((set) => ({
    farmDetails: null,
    isOnboarding: false,
    onboardingStep: 1,
    setFarmDetails: (farmDetails) => set({ farmDetails }),
    setOnboarding: (isOnboarding) => set({ isOnboarding }),
    setOnboardingStep: (onboardingStep) => set({ onboardingStep }),
    nextStep: () => set((state) => ({ onboardingStep: Math.min(state.onboardingStep + 1, 4) })),
    prevStep: () => set((state) => ({ onboardingStep: Math.max(state.onboardingStep - 1, 1) })),
}));
