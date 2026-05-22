import { ENV } from '@/config/env';

export const weatherService = {
  async getCurrentWeather(lat: number, lon: number) {
    const key = ENV.weather.openWeatherKey;
    if (!key) return null;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
    if (!res.ok) throw new Error('Weather fetch failed');
    return res.json();
  },

  async getForecast(lat: number, lon: number) {
    const key = ENV.weather.openWeatherKey;
    if (!key) return null;
    const res = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${key}`);
    if (!res.ok) throw new Error('Forecast fetch failed');
    return res.json();
  },

  generateAdvisories(weather: { temp: number; humidity: number; windSpeed: number; rainfall: number }) {
    const advisories: { message: string; priority: 'high' | 'medium' | 'low' }[] = [];
    if (weather.rainfall > 0) advisories.push({ message: 'Rain expected — delay pesticide spraying', priority: 'high' });
    if (weather.windSpeed > 15) advisories.push({ message: 'High wind — avoid spraying operations', priority: 'high' });
    if (weather.humidity > 80) advisories.push({ message: 'High humidity — watch for fungal diseases', priority: 'medium' });
    if (weather.temp > 40) advisories.push({ message: 'Heat wave — irrigate in evening, protect nursery', priority: 'high' });
    if (weather.temp < 5) advisories.push({ message: 'Frost warning — protect sensitive crops', priority: 'high' });
    return advisories;
  },
};
