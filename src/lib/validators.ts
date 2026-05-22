import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain an uppercase letter').regex(/[0-9]/, 'Password must contain a number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const phoneSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number'),
});

export const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits').regex(/^\d+$/, 'OTP must contain only digits'),
});

export const onboardingStep1Schema = z.object({
  displayName: z.string().min(2).max(100),
  state: z.string().min(1, 'Please select a state'),
  district: z.string().min(1, 'Please select a district'),
  language: z.enum(['en', 'hi']),
});

export const onboardingStep2Schema = z.object({
  landSizeAcres: z.number().min(0.1, 'Land size must be at least 0.1 acres').max(10000),
  soilType: z.enum(['clay', 'sandy', 'loamy', 'black', 'red', 'laterite']),
  irrigationType: z.enum(['drip', 'flood', 'rainfed', 'sprinkler', 'canal']),
});

export const onboardingStep3Schema = z.object({
  primaryCrop: z.string().min(1, 'Please select a primary crop'),
  secondaryCrops: z.array(z.string()).max(5, 'Maximum 5 secondary crops'),
});

export const fertilizerInputSchema = z.object({
  cropType: z.string().min(1, 'Select a crop'),
  soilType: z.string().min(1, 'Select soil type'),
  soilPh: z.number().min(0).max(14).optional(),
  previousCrop: z.string().optional(),
  growthStage: z.enum(['seedling', 'vegetative', 'flowering', 'fruiting', 'harvest']),
  irrigationType: z.string().min(1),
  landSizeAcres: z.number().min(0.1),
  budget: z.enum(['low', 'medium', 'high']),
});

export const chatMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(2000, 'Message too long'),
});

export const priceAlertSchema = z.object({
  commodity: z.string().min(1),
  targetPrice: z.number().min(1),
  condition: z.enum(['above', 'below']),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PhoneInput = z.infer<typeof phoneSchema>;
export type OtpInput = z.infer<typeof otpSchema>;
export type FertilizerFormInput = z.infer<typeof fertilizerInputSchema>;
