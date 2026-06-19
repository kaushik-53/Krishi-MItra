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

export const aiService = {
  async chat(message: string, context?: { crops?: string; state?: string; soilType?: string; preferredLanguage?: string }) {
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

      if (!text) throw new Error('Empty response from Gemini');

      return { response: text, fallback: false };
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      return {
        response: `Sorry, I'm having trouble connecting right now. Please try again in a moment.\n\nError: ${err.message}`,
        fallback: true
      };
    }
  },

  async detectDisease(imageBase64: string) {
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
    } catch (error: any) {
      console.error('Failed to query local detection service:', error);
      throw new Error(error.message === 'Local detection service returned an error' ? error.message : 'Local detection service offline');
    }
  },
};
