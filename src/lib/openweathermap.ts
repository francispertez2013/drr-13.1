// OpenWeatherMap API integration - Removed WeatherLink dependencies
import { supabase } from './supabase';

export interface OpenWeatherMapCurrentData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  visibility: number;
  condition: string;
  description: string;
  pressure: number;
  feels_like: number;
  wind_direction: number;
  uv_index?: number;
  clouds: number;
  sunrise: number;
  sunset: number;
}

export interface OpenWeatherMapForecast {
  date: string;
  temperature_high: number;
  temperature_low: number;
  condition: string;
  humidity: number;
  wind_speed: number;
  precipitation: number;
  icon: string;
  description: string;
  clouds: number;
}

interface OpenWeatherCurrentResponse {
  coord: { lon: number; lat: number };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: { all: number };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface OpenWeatherForecastResponse {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: { all: number };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: { '3h': number };
    snow?: { '3h': number };
    sys: { pod: string };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export class OpenWeatherMapAPI {
  private static readonly API_KEY = '23a8e25f86655fb649c882839a57653b';
  private static readonly BASE_URL = 'https://api.openweathermap.org/data/2.5';
  private static readonly LAT = 13.0293;
  private static readonly LON = 123.445;

  private static async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${this.BASE_URL}/${endpoint}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`OpenWeatherMap API error: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OpenWeatherMap API request failed:', error);
      throw error;
    }
  }

  static async fetchCurrentWeather(): Promise<OpenWeatherMapCurrentData | null> {
    try {
      const data = await this.makeRequest<OpenWeatherCurrentResponse>(
        `weather?lat=${this.LAT}&lon=${this.LON}&appid=${this.API_KEY}&units=metric`
      );

      // Convert OpenWeatherMap condition to our format
      const weatherMain = data.weather[0]?.main.toLowerCase() || 'clear';
      let condition = 'sunny';
      
      switch (weatherMain) {
        case 'clear':
          condition = 'sunny';
          break;
        case 'clouds':
          condition = data.clouds.all > 75 ? 'cloudy' : 'partly-cloudy';
          break;
        case 'rain':
        case 'drizzle':
          condition = 'rainy';
          break;
        case 'thunderstorm':
          condition = 'stormy';
          break;
        case 'snow':
          condition = 'cloudy';
          break;
        case 'mist':
        case 'fog':
        case 'haze':
          condition = 'cloudy';
          break;
        default:
          condition = 'partly-cloudy';
      }

      const weatherData: OpenWeatherMapCurrentData = {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        wind_speed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        visibility: Math.round((data.visibility || 10000) / 1000), // Convert m to km
        condition,
        description: data.weather[0]?.description || 'Clear',
        pressure: data.main.pressure,
        feels_like: Math.round(data.main.feels_like),
        wind_direction: data.wind.deg || 0,
        clouds: data.clouds.all,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      };

      return weatherData;
    } catch (error) {
      console.error('Error fetching current weather from OpenWeatherMap:', error);
      return null;
    }
  }

  static async fetchForecast(): Promise<OpenWeatherMapForecast[]> {
    try {
      const data = await this.makeRequest<OpenWeatherForecastResponse>(
        `forecast?lat=${this.LAT}&lon=${this.LON}&appid=${this.API_KEY}&units=metric`
      );

      // Group forecast data by day and get daily highs/lows
      const dailyForecasts = new Map<string, any>();
      
      data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        const temp = item.main.temp;
        const weatherMain = item.weather[0]?.main.toLowerCase() || 'clear';
        
        if (!dailyForecasts.has(date)) {
          dailyForecasts.set(date, {
            date,
            temps: [temp],
            humidity: item.main.humidity,
            wind_speed: item.wind.speed * 3.6, // Convert m/s to km/h
            precipitation: item.pop * 100, // Convert to percentage
            weather: item.weather[0],
            clouds: item.clouds.all
          });
        } else {
          const existing = dailyForecasts.get(date);
          existing.temps.push(temp);
        }
      });

      // Convert to our forecast format (5 days)
      const forecasts: OpenWeatherMapForecast[] = [];
      let dayCount = 0;
      
      for (const [date, dayData] of dailyForecasts) {
        if (dayCount >= 5) break;
        
        const temps = dayData.temps;
        const weatherMain = dayData.weather.main.toLowerCase();
        
        let condition = 'sunny';
        let icon = 'sunny';
        
        switch (weatherMain) {
          case 'clear':
            condition = 'sunny';
            icon = 'sunny';
            break;
          case 'clouds':
            condition = dayData.clouds > 75 ? 'cloudy' : 'partly-cloudy';
            icon = dayData.clouds > 75 ? 'cloudy' : 'partly-cloudy';
            break;
          case 'rain':
          case 'drizzle':
            condition = 'rainy';
            icon = 'rainy';
            break;
          case 'thunderstorm':
            condition = 'stormy';
            icon = 'stormy';
            break;
          default:
            condition = 'partly-cloudy';
            icon = 'partly-cloudy';
        }

        forecasts.push({
          date,
          temperature_high: Math.round(Math.max(...temps)),
          temperature_low: Math.round(Math.min(...temps)),
          condition,
          humidity: dayData.humidity,
          wind_speed: Math.round(dayData.wind_speed),
          precipitation: Math.round(dayData.precipitation),
          icon,
          description: dayData.weather.description,
          clouds: dayData.clouds
        });
        
        dayCount++;
      }

      return forecasts;
    } catch (error) {
      console.error('Error fetching forecast from OpenWeatherMap:', error);
      return [];
    }
  }

  static async getWeatherAlerts(): Promise<string[]> {
    try {
      const currentWeather = await this.fetchCurrentWeather();
      if (!currentWeather) return [];

      const alerts: string[] = [];
      
      // Generate alerts based on weather conditions
      if (currentWeather.temperature >= 35) {
        alerts.push('Heat Warning: Extreme temperatures expected');
      }
      
      if (currentWeather.wind_speed >= 50) {
        alerts.push('High Wind Warning: Strong winds may cause damage');
      }
      
      if (currentWeather.condition === 'stormy') {
        alerts.push('Thunderstorm Warning: Severe weather conditions');
      }

      if (currentWeather.visibility < 1) {
        alerts.push('Low Visibility Warning: Fog or haze conditions');
      }
      
      return alerts;
    } catch (error) {
      console.error('Error generating weather alerts:', error);
      return [];
    }
  }

  static async updateWeatherInDatabase(weatherData: OpenWeatherMapCurrentData): Promise<boolean> {
    try {
      const alerts = await this.getWeatherAlerts();
      
      // Weather data is no longer stored in database, only used for display
      console.log('Weather data updated (display only):', weatherData);

      return true;
    } catch (error) {
      console.error('Error updating weather in database:', error);
      return false;
    }
  }

  static async syncForecastData(): Promise<boolean> {
    try {
      const forecastData = await this.fetchForecast();
      if (forecastData.length === 0) {
        console.warn('No forecast data available');
        return false;
      }

      // Forecast data is no longer stored in database, only used for display
      console.log('Forecast data synced (display only):', forecastData);

      return true;
    } catch (error) {
      console.error('Error syncing forecast data:', error);
      return false;
    }
  }
}

export const openWeatherAPI = OpenWeatherMapAPI;