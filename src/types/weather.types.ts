export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
  hourly: HourlyForecast[];
  location: WeatherLocation;
  advisories: FarmAdvisory[];
  lastUpdated: number;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  uvIndex: number;
  rainfall: number;
  pressure: number;
  visibility: number;
  condition: string;
  conditionIcon: string;
  description: string;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  condition: string;
  conditionIcon: string;
  description: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  condition: string;
  conditionIcon: string;
}

export interface WeatherLocation {
  lat: number;
  lon: number;
  city: string;
  state: string;
  country: string;
}

export interface FarmAdvisory {
  id: string;
  type: 'spray' | 'irrigate' | 'harvest' | 'sow' | 'protect' | 'general';
  priority: 'low' | 'medium' | 'high';
  message: string;
  messageHi: string;
  icon: string;
}
