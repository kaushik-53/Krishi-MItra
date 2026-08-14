import { ENV } from '@/config/env';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const SYSTEM_PROMPT = `You are Krishi Mitra, an expert AI agricultural assistant for Indian farmers. 
You provide helpful, practical advice about:
- Crop diseases and treatments (organic and chemical)
- Fertilizer recommendations (NPK, micronutrients)
- Weather-based farming advice
- Sowing and harvesting timelines for Indian crops
- Market prices and best time to sell
- Government schemes for farmers (PM-Kisan, MSP, etc.)
- Pest control methods
- Soil health and irrigation

Guidelines:
- Always respond in the same language as the user's message (Hindi or English)
- Keep responses practical and easy to understand for rural farmers
- Provide specific quantities and timelines when relevant
- Mention both organic and chemical options where applicable
- Be concise but comprehensive
- If asked in Hindi, respond fully in Hindi using simple language`;
const MOCK_DISEASES = [
  {
    diseaseName: "Tomato Early Blight (Alternaria solani)",
    confidence: 94.2,
    severity: "high",
    description: "Fungal disease causing dark spots with concentric rings on older leaves, leading to yellowing and leaf drop. Aggravated by warm, humid weather.",
    treatments: [
      { type: "organic", name: "Neem Oil Spray", dosage: "5ml per litre", application: "Spray leaves thoroughly every 7-10 days" },
      { type: "chemical", name: "Chlorothalonil Fungicide", dosage: "2g per litre", application: "Apply at first sign of disease and repeat weekly" }
    ],
    prevention: ["Rotate crops every 2-3 years", "Water the soil directly, not the foliage", "Prune lower leaves to improve air circulation"]
  },
  {
    diseaseName: "Potato Late Blight (Phytophthora infestans)",
    confidence: 88.5,
    severity: "critical",
    description: "Highly destructive oomycete disease causing dark, water-soaked lesions on leaves and white fungal growth underneath. Can destroy entire crops rapidly.",
    treatments: [
      { type: "organic", name: "Copper Fungicide", dosage: "4g per litre", application: "Apply at weekly intervals during wet weather" },
      { type: "chemical", name: "Mancozeb 75 WP", dosage: "2.5g per litre", application: "Foliar spray at first warning and repeat every 7 days" }
    ],
    prevention: ["Plant certified disease-free seed tubers", "Ensure good soil drainage", "Remove and destroy infected volunteer potato plants"]
  },
  {
    diseaseName: "Healthy Corn Leaf",
    confidence: 98.1,
    severity: "low",
    description: "The corn foliage appears healthy with optimal chlorophyll levels and strong cellular structure. No disease signatures detected.",
    treatments: [],
    prevention: ["Maintain regular watering and fertilization schedule", "Inspect regularly for pests", "Maintain proper crop spacing"]
  },
  {
    diseaseName: "Apple Scab (Venturia inaequalis)",
    confidence: 91.7,
    severity: "medium",
    description: "Fungal disease causing olive-green to black velvety lesions on leaves and scabby lesions on fruit, weakening the tree.",
    treatments: [
      { type: "organic", name: "Sulfur Spray", dosage: "3g per litre", application: "Apply at bud break and every 10 days" },
      { type: "chemical", name: "Captan 50 WP", dosage: "2g per litre", application: "Apply at green tip and repeat at petal fall" }
    ],
    prevention: ["Rake and destroy fallen leaves in autumn", "Prune trees to improve canopy air flow", "Plant scab-resistant cultivars"]
  }
];

function selectMockPrediction(imageBase64) {
  const hash = imageBase64 ? imageBase64.length : 0;
  const index = hash % MOCK_DISEASES.length;
  const mock = MOCK_DISEASES[index];
  const confidence = Math.round((85 + (hash % 13)) * 10) / 10;
  return {
    ...mock,
    confidence,
    description: mock.description + " [NOTE: Running in client fallback mode because the local backend is offline or blocked by HTTPS security.]"
  };
}

export const aiService = {
    async chat(message, context) {
        const apiKey = ENV.ai.geminiKey;
        if (!apiKey) {
            return { response: 'AI service is not configured. Please add your VITE_GEMINI_API_KEY to the .env file.', fallback: true };
        }
        const contextNote = context
            ? `\n[Farmer context: language=${context.preferredLanguage || 'en'}${context.crops ? ', crops=' + context.crops : ''}${context.state ? ', state=' + context.state : ''}${context.soilType ? ', soil=' + context.soilType : ''}]`
            : '';
        try {
            const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: SYSTEM_PROMPT + contextNote + '\n\nFarmer\'s question: ' + message }]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1024,
                    }
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error?.message || 'Gemini API error');
            }
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text)
                throw new Error('Empty response from Gemini');
            return { response: text, fallback: false };
        }
        catch (err) {
            console.error('Gemini chat error:', err);
            return {
                response: `Sorry, I'm having trouble connecting right now. Please try again in a moment.\n\nError: ${err.message}`,
                fallback: true
            };
        }
    },
    async detectDisease(imageBase64) {
        const baseUrl = ENV.ai.baseUrl || 'http://localhost:8000';
        try {
            const res = await fetch(`${baseUrl}/api/v1/detect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imageBase64 }),
            });
            if (!res.ok) {
                throw new Error('Local detection service returned an error');
            }
            return await res.json();
        }
        catch (error) {
            console.warn('Local ML backend offline or blocked by HTTPS. Falling back to client-side simulation.', error);
            return selectMockPrediction(imageBase64);
        }
    },
};
