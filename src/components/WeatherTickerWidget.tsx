import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, AlertTriangle, Wind, Droplets, Thermometer, RefreshCw, Wifi, WifiOff, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { openWeatherAPI, OpenWeatherMapCurrentData } from '../lib/openweathermap';

interface WeatherData {
  temperature: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  description: string;
  location: string;
  alerts: string[];
  last_updated: string;
}


const WeatherTickerWidget: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    temperature: 28,
    humidity: 75,
    wind_speed: 12,
    condition: 'partly-cloudy',
    description: 'Partly Cloudy',
    location: 'Pio Duran, Albay',
    alerts: [],
    last_updated: new Date().toISOString()
  });

  const [isOnline, setIsOnline] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchWeatherData();
    
    // Auto refresh every 15 minutes for production
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 15 * 60 * 1000);

    // Check online status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);



  const fetchWeatherData = async () => {
    try {
      setIsRefreshing(true);
      
      // Try to fetch fresh data from OpenWeatherMap API
      if (isOnline) {
        try {
          const freshData = await openWeatherAPI.fetchCurrentWeather();
          if (freshData) {
            // Get alerts
            let alerts: string[] = [];
            try {
              alerts = await openWeatherAPI.getWeatherAlerts();
            } catch (alertError) {
              console.warn('Could not fetch weather alerts:', alertError);
            }

            setWeatherData({
              temperature: freshData.temperature,
              humidity: freshData.humidity,
              wind_speed: freshData.wind_speed,
              condition: freshData.condition,
              description: freshData.description,
              location: 'Pio Duran, Albay',
              alerts,
              last_updated: new Date().toISOString()
            });
            
            setLastRefresh(new Date());
            return;
          }
        } catch (apiError) {
          console.warn('OpenWeatherMap API failed, falling back to database:', apiError);
        }
      }
      
      // Final fallback to default data
      console.warn('Using default weather data');
      setWeatherData(prev => ({
        ...prev,
        last_updated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeatherData(prev => ({
        ...prev,
        last_updated: new Date().toISOString()
      }));
    } finally {
      setIsRefreshing(false);
    }
  };


  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="text-yellow-400" size={24} />;
      case 'partly-cloudy':
      case 'cloudy':
        return <Cloud className="text-gray-400" size={24} />;
      case 'rainy':
      case 'light-rain':
        return <CloudRain className="text-blue-400" size={24} />;
      case 'stormy':
      case 'thunderstorm':
        return <AlertTriangle className="text-red-400" size={24} />;
      default:
        return <Cloud className="text-gray-400" size={24} />;
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 35) return 'from-red-500 to-red-600'; // Very hot
    if (temp >= 30) return 'from-orange-500 to-orange-600'; // Hot
    if (temp >= 25) return 'from-yellow-500 to-yellow-600'; // Warm
    if (temp >= 20) return 'from-green-500 to-green-600'; // Mild
    return 'from-blue-500 to-blue-600'; // Cool
  };

  const getTemperatureTextColor = (temp: number) => {
    if (temp >= 30) return 'text-white'; // Hot temperatures - white text
    return 'text-gray-900'; // Cooler temperatures - dark text
  };

  const manualRefresh = () => {
    fetchWeatherData();
  };

  return (
    <div className={`weather-ticker-widget bg-gradient-to-r ${getTemperatureColor(weatherData.temperature)} text-white py-3 px-4 shadow-lg border-t-4 border-yellow-500 border-b-4 border-blue-950 relative z-60`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Weather Info - Scrolling Ticker */}
          <div className="flex-1 overflow-hidden">
            <div className="flex items-center space-x-8 animate-marquee whitespace-nowrap">
              <div className="flex items-center space-x-3">
                {getWeatherIcon(weatherData.condition)}
                <span className={`font-bold text-lg ${getTemperatureTextColor(weatherData.temperature)}`}>
                  {weatherData.temperature}°C
                </span>
                <span className={`${getTemperatureTextColor(weatherData.temperature)}`}>
                  {weatherData.description}
                </span>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-1">
                  <Droplets size={16} className={getTemperatureTextColor(weatherData.temperature)} />
                  <span className={`text-sm ${getTemperatureTextColor(weatherData.temperature)}`}>
                    {weatherData.humidity}% Humidity
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Wind size={16} className={getTemperatureTextColor(weatherData.temperature)} />
                  <span className={`text-sm ${getTemperatureTextColor(weatherData.temperature)}`}>
                    {weatherData.wind_speed} km/h Wind
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Thermometer size={16} className={getTemperatureTextColor(weatherData.temperature)} />
                  <span className={`text-sm ${getTemperatureTextColor(weatherData.temperature)}`}>
                    Feels like {Math.round(weatherData.temperature + (weatherData.humidity > 70 ? 2 : 0))}°C
                  </span>
                </div>
              </div>

              {weatherData.alerts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <AlertTriangle size={16} className="text-yellow-300 animate-pulse" />
                  <span className="text-yellow-100 font-medium">
                    {weatherData.alerts.join(' • ')}
                  </span>
                </div>
              )}

              <div className={`text-sm ${getTemperatureTextColor(weatherData.temperature)} opacity-75`}>
                📍 {weatherData.location} • Updated: {new Date(weatherData.last_updated).toLocaleTimeString()} •{' '}
                <a 
                  href="https://openweathermap.org" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`${getTemperatureTextColor(weatherData.temperature)} hover:opacity-90 underline inline-flex items-center`}
                >
                  OpenWeatherMap
                  <ExternalLink size={12} className="ml-1" />
                </a>
                {!isOnline && <span className="text-red-300 ml-2">(Offline)</span>}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3 ml-4">
            <div className="flex items-center space-x-1">
              {isOnline ? (
                <Wifi size={16} className={`${getTemperatureTextColor(weatherData.temperature)} opacity-75`} />
              ) : (
                <WifiOff size={16} className="text-red-300" />
              )}
            </div>
            
            <button
              onClick={manualRefresh}
              disabled={isRefreshing}
              className={`${getTemperatureTextColor(weatherData.temperature)} hover:opacity-80 transition-all duration-200 disabled:opacity-50 ${isRefreshing ? 'animate-spin' : 'hover:scale-110'}`}
              title="Refresh weather data"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTickerWidget;