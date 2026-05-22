import { useTranslation } from 'react-i18next';
import { Cloud, Droplets, Wind, Thermometer, Sun, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import { weatherService } from '@/services/weather.service';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: string;
}

const conditionEmoji: Record<string, string> = {
  Clear: '☀️', Clouds: '☁️', Rain: '🌧️', Drizzle: '🌦️', Thunderstorm: '⛈️',
  Snow: '❄️', Mist: '🌫️', Haze: '🌫️', Fog: '🌫️', Smoke: '🌫️',
};

export default function WeatherWidget() {
  const { t } = useTranslation();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        // Try to get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const data = await weatherService.getCurrentWeather(pos.coords.latitude, pos.coords.longitude);
                if (data) {
                  setWeather({
                    temp: Math.round(data.main.temp),
                    feelsLike: Math.round(data.main.feels_like),
                    humidity: data.main.humidity,
                    wind: Math.round(data.wind.speed * 3.6), // m/s to km/h
                    condition: data.weather?.[0]?.main || 'Clear',
                    icon: conditionEmoji[data.weather?.[0]?.main] || '🌤️',
                  });
                  setLocation(data.name || '');
                }
              } catch {
                // Weather API failed
              } finally {
                setLoading(false);
              }
            },
            () => setLoading(false), // location permission denied
            { timeout: 5000 }
          );
        } else {
          setLoading(false);
        }
      } catch {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  if (loading) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
        <h3 className="text-sm font-medium text-text-secondary mb-4">{t('dashboard.weatherTitle')}</h3>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
        <h3 className="text-sm font-medium text-text-secondary mb-4">{t('dashboard.weatherTitle')}</h3>
        <div className="text-center py-8">
          <Cloud className="w-10 h-10 text-text-muted mx-auto mb-2" />
          <p className="text-sm text-text-muted">Enable location access to see live weather data.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-text-secondary">{t('dashboard.weatherTitle')}</h3>
        {location && (
          <span className="text-xs text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {location}
          </span>
        )}
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-end gap-2">
            <span className="text-5xl font-bold text-text-primary font-mono">{weather.temp}°</span>
            <span className="text-text-muted text-sm mb-2">/{weather.feelsLike}° feels like</span>
          </div>
          <p className="text-primary-400 font-medium mt-1">{weather.condition}</p>
        </div>
        <span className="text-6xl">{weather.icon}</span>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { icon: Droplets, label: t('weather.humidity'), value: `${weather.humidity}%`, color: 'text-blue-400' },
          { icon: Wind, label: t('weather.wind'), value: `${weather.wind} km/h`, color: 'text-cyan-400' },
          { icon: Sun, label: t('weather.uvIndex'), value: '--', color: 'text-amber-400' },
          { icon: Thermometer, label: 'Feels', value: `${weather.feelsLike}°C`, color: 'text-red-400' },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="text-center p-2 rounded-xl bg-surface-2/50">
              <Icon className={`w-4 h-4 ${item.color} mx-auto mb-1`} />
              <p className="text-xs text-text-muted">{item.label}</p>
              <p className="text-sm font-semibold text-text-primary font-mono">{item.value}</p>
            </div>
          );
        })}
      </div>

      <div className="p-3 rounded-xl bg-primary-600/10 border border-primary-400/20">
        <p className="text-xs text-primary-400 font-medium">
          {weather.humidity > 80
            ? '⚠️ High humidity — watch for fungal diseases'
            : weather.temp > 38
            ? '🔥 High heat — irrigate during evening hours'
            : '💧 Good conditions for farming activities'}
        </p>
      </div>
    </Card>
  );
}
