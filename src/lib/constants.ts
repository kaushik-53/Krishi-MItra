export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

export const MAJOR_CROPS = [
  'Rice', 'Wheat', 'Maize', 'Jowar', 'Bajra', 'Ragi', 'Barley',
  'Cotton', 'Jute', 'Sugarcane', 'Tobacco', 'Tea', 'Coffee', 'Rubber',
  'Groundnut', 'Soybean', 'Sunflower', 'Sesame', 'Mustard', 'Linseed', 'Coconut',
  'Tomato', 'Potato', 'Onion', 'Brinjal', 'Cauliflower', 'Cabbage', 'Peas',
  'Chilli', 'Turmeric', 'Ginger', 'Garlic', 'Coriander', 'Cumin',
  'Mango', 'Banana', 'Apple', 'Grapes', 'Orange', 'Papaya', 'Guava', 'Pomegranate',
  'Chickpea', 'Pigeon Pea', 'Lentil', 'Moong', 'Urad', 'Masoor',
] as const;

export const SOIL_TYPES = [
  { value: 'clay', label: 'Clay (चिकनी मिट्टी)', labelHi: 'चिकनी मिट्टी' },
  { value: 'sandy', label: 'Sandy (रेतीली)', labelHi: 'रेतीली' },
  { value: 'loamy', label: 'Loamy (दोमट)', labelHi: 'दोमट' },
  { value: 'black', label: 'Black (काली मिट्टी)', labelHi: 'काली मिट्टी' },
  { value: 'red', label: 'Red (लाल मिट्टी)', labelHi: 'लाल मिट्टी' },
  { value: 'laterite', label: 'Laterite (लैटराइट)', labelHi: 'लैटराइट' },
] as const;

export const IRRIGATION_TYPES = [
  { value: 'drip', label: 'Drip (ड्रिप)', labelHi: 'ड्रिप' },
  { value: 'flood', label: 'Flood (बाढ़)', labelHi: 'बाढ़' },
  { value: 'rainfed', label: 'Rainfed (वर्षा आधारित)', labelHi: 'वर्षा आधारित' },
  { value: 'sprinkler', label: 'Sprinkler (स्प्रिंकलर)', labelHi: 'स्प्रिंकलर' },
  { value: 'canal', label: 'Canal (नहर)', labelHi: 'नहर' },
] as const;

export const GROWTH_STAGES = [
  { value: 'seedling', label: 'Seedling', labelHi: 'अंकुर' },
  { value: 'vegetative', label: 'Vegetative', labelHi: 'वनस्पति' },
  { value: 'flowering', label: 'Flowering', labelHi: 'फूल' },
  { value: 'fruiting', label: 'Fruiting', labelHi: 'फल' },
  { value: 'harvest', label: 'Harvest', labelHi: 'कटाई' },
] as const;

export const SEVERITY_COLORS = {
  low: { bg: 'bg-info/20', text: 'text-info', border: 'border-info/30' },
  medium: { bg: 'bg-warning/20', text: 'text-warning', border: 'border-warning/30' },
  high: { bg: 'bg-amber-800/20', text: 'text-amber-800', border: 'border-amber-800/30' },
  critical: { bg: 'bg-danger/20', text: 'text-danger', border: 'border-danger/30' },
} as const;

export const NOTIFICATION_ICONS: Record<string, string> = {
  rain: '🌧️',
  pest: '🦟',
  price: '📈',
  sow: '🌱',
  spray: '💊',
  scheme: '📢',
  tip: '🎓',
};

export const APP_ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  dashboard: '/dashboard',
  diseaseDetection: '/disease-detection',
  weather: '/weather',
  fertilizer: '/fertilizer',
  market: '/market',
  chatbot: '/chatbot',
  voiceAssistant: '/voice-assistant',
  notifications: '/notifications',
  farmProfile: '/farm-profile',
  admin: '/admin',
} as const;
