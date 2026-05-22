import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Cloud, Droplets, Wind, Sun, Eye, ArrowUp, ArrowDown, MapPin } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PageWrapper from '@/components/layout/PageWrapper';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { weatherService } from '@/services/weather.service';
import { useAuthStore } from '@/store/authStore';

export default function WeatherAdvisory() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    async function fetchWeatherData(lat: number, lon: number) {
      try {
        const [currentData, forecastData] = await Promise.all([
          weatherService.getCurrentWeather(lat, lon),
          weatherService.getForecast(lat, lon)
        ]);
        
        if (currentData) {
          setWeather(currentData);
          setLocationName(currentData.name || '');
        }
        if (forecastData) {
          setForecast(forecastData);
        }
      } catch (e) {
        console.error("Weather API Error:", e);
      } finally {
        setLoading(false);
      }
    }

    async function fetchWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchWeatherData(pos.coords.latitude, pos.coords.longitude),
          (err) => {
            console.warn("Geolocation Error or Timeout:", err.message, "Falling back to default location.");
            // Fallback to New Delhi coordinates
            fetchWeatherData(28.6139, 77.2090);
          },
          { timeout: 15000, maximumAge: 60000 }
        );
      } else {
        console.warn("Geolocation not supported. Falling back to default location.");
        fetchWeatherData(28.6139, 77.2090);
      }
    }
    fetchWeather();
  }, []);

  const locationDisplay = locationName || (user?.farm?.district ? `${user.farm.district}, ${user.farm.state}` : 'Unknown Location');

  // Parse forecast data
  let hourlyData: any[] = [];
  let weekForecast: any[] = [];

  if (forecast && forecast.list) {
    // Next 6 items for hourly chart (3-hour intervals)
    hourlyData = forecast.list.slice(0, 6).map((item: any) => {
      const date = new Date(item.dt * 1000);
      return {
        time: date.toLocaleTimeString([], { hour: 'numeric' }),
        temp: Math.round(item.main.temp),
      };
    });

    // Group by day for 5-day forecast
    const dailyData: Record<string, any> = {};
    forecast.list.forEach((item: any) => {
      const dateStr = item.dt_txt.split(' ')[0];
      if (!dailyData[dateStr]) {
        dailyData[dateStr] = {
          day: new Date(item.dt * 1000).toLocaleDateString([], { weekday: 'short' }),
          high: item.main.temp_max,
          low: item.main.temp_min,
          pop: item.pop || 0,
          weather: item.weather[0].main,
        };
      } else {
        dailyData[dateStr].high = Math.max(dailyData[dateStr].high, item.main.temp_max);
        dailyData[dateStr].low = Math.min(dailyData[dateStr].low, item.main.temp_min);
        dailyData[dateStr].pop = Math.max(dailyData[dateStr].pop, item.pop || 0);
      }
    });

    weekForecast = Object.values(dailyData).slice(0, 5).map((d: any) => ({
      ...d,
      high: Math.round(d.high),
      low: Math.round(d.low),
      rain: Math.round(d.pop * 100),
      icon: d.weather.toLowerCase().includes('rain') ? '🌧️' : d.weather.toLowerCase().includes('cloud') ? '⛅' : '☀️',
    }));
  }

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
        <motion.div variants={fadeInUp}>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-text-primary">{t('weather.title')}</h1>
          <p className="text-text-secondary mt-1 flex items-center gap-1">
            <MapPin className="w-4 h-4" /> {locationDisplay}
          </p>
        </motion.div>

        {!weather && !loading ? (
          <motion.div variants={fadeInUp}>
            <Card className="flex flex-col items-center justify-center py-16 text-center h-full">
              <Cloud className="w-16 h-16 text-text-muted/30 mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Weather Data Unavailable</h3>
              <p className="text-text-muted max-w-sm">Please ensure location services are enabled and your API keys are configured.</p>
            </Card>
          </motion.div>
        ) : loading ? (
           <motion.div variants={fadeInUp}>
             <Card className="flex flex-col items-center justify-center py-16 text-center h-full">
               <div className="w-10 h-10 border-2 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-text-muted">Fetching local weather data...</p>
             </Card>
           </motion.div>
        ) : (
          <>
            {/* Current Weather Card */}
            <motion.div variants={fadeInUp}>
              <Card className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <p className="text-sm text-text-muted mb-1">{t('weather.current')}</p>
                    <div className="flex items-end gap-3">
                      <span className="text-6xl font-bold text-text-primary font-mono">{Math.round(weather.main.temp)}°</span>
                      <div className="mb-2">
                        <p className="text-primary-400 font-medium">{weather.weather[0]?.main}</p>
                        <p className="text-xs text-text-muted">Feels like {Math.round(weather.main.feels_like)}°C</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-7xl">
                    {weather.weather[0]?.main.toLowerCase().includes('rain') ? '🌧️' : weather.weather[0]?.main.toLowerCase().includes('cloud') ? '⛅' : '☀️'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                  {[
                    { icon: Droplets, label: t('weather.humidity'), value: `${weather.main.humidity}%`, color: 'text-blue-400' },
                    { icon: Wind, label: t('weather.wind'), value: `${Math.round(weather.wind.speed * 3.6)} km/h`, color: 'text-cyan-400' },
                    { icon: Sun, label: 'Pressure', value: `${weather.main.pressure} hPa`, color: 'text-amber-400' },
                    { icon: Eye, label: 'Visibility', value: `${(weather.visibility / 1000).toFixed(1)} km`, color: 'text-primary-400' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="p-3 rounded-xl bg-surface-2/50 text-center">
                        <Icon className={`w-5 h-5 ${item.color} mx-auto mb-1`} />
                        <p className="text-[10px] text-text-muted">{item.label}</p>
                        <p className="text-sm font-semibold text-text-primary font-mono">{item.value}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {forecast && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Temperature Chart */}
                <motion.div variants={fadeInUp}>
                  <Card>
                    <h3 className="text-sm font-medium text-text-secondary mb-4">Today's Temperature</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={hourlyData}>
                        <defs>
                          <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#52B788" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#52B788" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E3025" />
                        <XAxis dataKey="time" tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} />
                        <YAxis tick={{ fill: '#5C7A6B', fontSize: 11 }} axisLine={false} domain={['dataMin - 2', 'dataMax + 2']} />
                        <Tooltip contentStyle={{ background: '#162419', border: '1px solid rgba(82,183,136,0.15)', borderRadius: '12px', color: '#F0FFF4' }} />
                        <Area type="monotone" dataKey="temp" stroke="#52B788" fill="url(#tempGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                </motion.div>

                {/* 5-Day Forecast */}
                <motion.div variants={fadeInUp}>
                  <Card>
                    <h3 className="text-sm font-medium text-text-secondary mb-4">{t('weather.forecast')}</h3>
                    <div className="space-y-2">
                      {weekForecast.map((day) => (
                        <div key={day.day} className="flex items-center justify-between py-2 border-b border-glass-border last:border-0">
                          <span className="text-sm text-text-primary font-medium w-10">{day.day}</span>
                          <span className="text-xl">{day.icon}</span>
                          <div className="flex items-center gap-3 text-sm font-mono">
                            <span className="text-text-primary flex items-center gap-0.5"><ArrowUp className="w-3 h-3 text-danger" />{day.high}°</span>
                            <span className="text-text-muted flex items-center gap-0.5"><ArrowDown className="w-3 h-3 text-info" />{day.low}°</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-text-muted font-mono">{day.rain}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>
            )}

            {/* Farm Advisories (Dynamic based on weather) */}
            <motion.div variants={fadeInUp}>
              <Card>
                <h3 className="text-lg font-semibold text-text-primary mb-4">{t('weather.advisory')}</h3>
                {weatherService.generateAdvisories({
                  temp: weather.main.temp,
                  humidity: weather.main.humidity,
                  windSpeed: weather.wind.speed * 3.6,
                  rainfall: weather.rain ? weather.rain['1h'] || 0 : 0
                }).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {weatherService.generateAdvisories({
                      temp: weather.main.temp,
                      humidity: weather.main.humidity,
                      windSpeed: weather.wind.speed * 3.6,
                      rainfall: weather.rain ? weather.rain['1h'] || 0 : 0
                    }).map((adv, i) => (
                      <div key={i} className={`p-4 rounded-xl border ${adv.priority === 'high' ? 'bg-danger/5 border-danger/20' : 'bg-warning/5 border-warning/20'}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-xl">⚠️</span>
                          <div>
                            <p className="text-sm text-text-primary font-medium">{adv.message}</p>
                            <Badge variant={adv.priority === 'high' ? 'danger' : 'warning'} size="sm" className="mt-2">{adv.priority}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border bg-success/5 border-success/20 text-success">
                    <p className="text-sm font-medium">Conditions are optimal. No critical advisories at this time.</p>
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </motion.div>
    </PageWrapper>
  );
}
