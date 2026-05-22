import { ENV } from '@/config/env';

export const aiService = {
  async chat(message: string, context?: { crops?: string; state?: string; soilType?: string; preferredLanguage?: string }) {
    const key = ENV.ai.geminiKey;
    if (!key) return { response: 'AI service not configured. Please add your Gemini API key.', fallback: true };

    const langInstruction = context?.preferredLanguage === 'hi' 
      ? 'CRITICAL: You MUST respond ONLY in Hindi (Devanagari script). Do not use English.'
      : context?.preferredLanguage === 'en'
      ? 'CRITICAL: You MUST respond ONLY in English.'
      : 'CRITICAL: You MUST respond in the EXACT same language the user uses in their prompt.';

    const systemPrompt = `You are Krishi Mitra, a friendly AI assistant for Indian farmers.
${langInstruction}
${context?.crops ? `Farmer grows ${context.crops} in ${context.state}. Soil: ${context.soilType}.` : ''}
Always give practical, actionable advice specific to Indian agriculture.
Reference ICAR guidelines when possible. Keep responses concise and friendly.
When unsure, recommend consulting local KVK (Krishi Vigyan Kendra).`;

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${message}` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
        }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I could not process your request.';
      return { response: text, fallback: false };
    } catch {
      return { response: 'Unable to connect to AI service. Please try again later.', fallback: true };
    }
  },

  async detectDisease(imageBase64: string) {
    const key = ENV.ai.geminiKey;
    if (!key) return null;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: 'Analyze this plant/crop leaf image. Identify the disease, confidence level, severity, treatment options (organic and chemical), and prevention tips. Respond in JSON format.' },
              { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
            ],
          }],
        }),
      });
      if (!res.ok) throw new Error('Vision request failed');
      return res.json();
    } catch { return null; }
  },
};
