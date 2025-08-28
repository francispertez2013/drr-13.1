import React, { useState, useEffect } from 'react';
import { 
  Calendar, Sun, Cloud, CloudRain, AlertTriangle, Thermometer, 
  Droplets, Wind, RefreshCw, ExternalLink, ChevronLeft, ChevronRight,
  Zap, Eye, EyeOff
} from 'lucide-react';

const WeatherForecastWidget = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExtended, setShowExtended] = useState(false);

  useEffect(() => {
    fetchForecast();
    
    const interval = setInterval(() => {
      fetchForecast();
    }, 6 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkVisibility = () => {
      setIsVisible(true);
    };
    
    const visibilityInterval = setInterval(checkVisibility, 30000);
    
    return () => clearInterval(visibilityInterval);
  }, []);

  const fetchForecast = async () => {
    try {
      setIsRefreshing(true);
      
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockForecast = generateMockForecast();
      setForecast(mockForecast);
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      const defaultForecast = generateMockForecast();
      setForecast(defaultForecast);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const generateMockForecast = () => {
    const forecastData = [];
    const conditions = [
      { name: 'Sunny', icon: 'sunny', color: 'text-yellow-500' },
      { name: 'Partly Cloudy', icon: 'partly-cloudy', color: 'text-gray-500' },
      { name: 'Cloudy', icon: 'cloudy', color: 'text-gray-600' },
      { name: 'Light Rain', icon: 'rainy', color: 'text-blue-500' },
      { name: 'Thunderstorm', icon: 'stormy', color: 'text-red-500' }
    ];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      
      forecastData.push({
        id: `day-${i}`,
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temperature_high: 26 + Math.floor(Math.random() * 12),
        temperature_low: 18 + Math.floor(Math.random() * 8),
        condition: condition.name,
        humidity: 50 + Math.floor(Math.random() * 40),
        wind_speed: 3 + Math.floor(Math.random() * 20),
        precipitation: Math.floor(Math.random() * 80),
        icon: condition.icon,
        color: condition.color,
        uv_index: 3 + Math.floor(Math.random() * 8),
        pressure: 1000 + Math.floor(Math.random() * 20)
      });
    }
    
    return forecastData;
  };

  const getWeatherIcon = (icon) => {
    switch (icon) {
      case 'sunny':
        return <Sun className="text-yellow-500" size={24} />;
      case 'partly-cloudy':
        return <Cloud className="text-gray-500" size={24} />;
      case 'cloudy':
        return <Cloud className="text-gray-600" size={24} />;
      case 'rainy':
        return <CloudRain className="text-blue-500" size={24} />;
      case 'stormy':
        return <Zap className="text-red-500" size={24} />;
      default:
        return <Cloud className="text-gray-500" size={24} />;
    }
  };

  const getDayName = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 30) return 'text-orange-600';
    if (temp >= 25) return 'text-yellow-600';
    if (temp >= 20) return 'text-green-600';
    return 'text-blue-600';
  };

  const getUvIndexColor = (uv) => {
    if (uv >= 8) return 'text-red-500';
    if (uv >= 6) return 'text-orange-500';
    if (uv >= 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const nextDays = () => {
    setCurrentIndex(Math.min(currentIndex + 1, forecast.length - 5));
  };

  const prevDays = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };

  if (loading) {
    return (
      <div className="bg-black border-t-2 border-gray-300 border-b-2 border-gray-300 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <RefreshCw className="animate-spin h-6 w-6 text-blue-600 mr-3" />
            <span className="text-gray-700 font-medium">Loading extended weather forecast...</span>
          </div>
        </div>
      </div>
    );
  }

  if (forecast.length === 0) {
    return (
      <div className="bg-white border-t-2 border-gray-300 border-b-2 border-gray-300 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <Cloud className="mx-auto h-10 w-10 mb-3" />
            <p className="text-base">Extended weather forecast not available</p>
            <button
              onClick={fetchForecast}
              className="text-blue-600 hover:text-blue-800 text-sm mt-3 inline-flex items-center"
            >
              <RefreshCw size={14} className="mr-1" />
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const visibleDays = forecast.slice(currentIndex, currentIndex + 5);

  return (
    <div className={`weather-forecast-widget bg-gradient-to-r from-white via-blue-50 to-white border-t-2 border-gray-300 border-b-2 border-gray-300 py-4 shadow-lg transition-all duration-500 relative z-55 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Calendar className="text-blue-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">10-Day Weather Forecast</h3>
              <p className="text-xs text-gray-500">Updated every 6 hours • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowExtended(!showExtended)}
              className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-full hover:bg-gray-100"
              title={showExtended ? "Collapse view" : "Expand view"}
            >
              {showExtended ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={fetchForecast}
              disabled={isRefreshing}
              className="text-blue-600 hover:text-blue-800 transition-all duration-200 disabled:opacity-50 hover:scale-110 p-2 rounded-full hover:bg-blue-50"
              title="Refresh forecast"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between mb-3">
          {currentIndex > 0 && (
            <button
              onClick={prevDays}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-gray-50 border border-gray-200"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
          )}
          
          <div className="flex-1"></div>
          
          {currentIndex < forecast.length - 5 && (
            <button
              onClick={nextDays}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all hover:bg-gray-50 border border-gray-200"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          )}
        </div>

        {/* Forecast Grid */}
        <div className={`grid gap-3 ${showExtended ? 'grid-cols-2 md:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5'}`}>
          {visibleDays.map((day, index) => (
            <div
              key={day.id}
              className={`rounded-2xl p-4 transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 ${
                index === 0 && currentIndex === 0
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 shadow-md' 
                  : 'bg-white hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className={`text-sm font-bold mb-2 ${
                index === 0 && currentIndex === 0 ? 'text-blue-800' : 'text-gray-700'
              }`}>
                {currentIndex === 0 && index === 0 ? 'Today' : day.dayOfWeek}
                <div className="text-xs font-normal text-gray-500">{day.fullDate}</div>
              </div>
              
              <div className="flex justify-center mb-3">
                {getWeatherIcon(day.icon)}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-bold ${getTemperatureColor(day.temperature_high)}`}>
                    {day.temperature_high}°
                  </div>
                  <div className={`text-sm ${index === 0 && currentIndex === 0 ? 'text-blue-600' : 'text-gray-500'}`}>
                    {day.temperature_low}°
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 truncate" title={day.condition}>
                  {day.condition}
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Droplets size={12} className="text-blue-500" />
                    <span className="text-xs text-gray-600">{day.humidity}%</span>
                  </div>
                  
                  {day.precipitation > 0 && (
                    <div className="flex items-center space-x-1">
                      <CloudRain size={12} className="text-blue-400" />
                      <span className="text-xs text-blue-600">{day.precipitation}%</span>
                    </div>
                  )}
                </div>
                
                {showExtended && (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Wind size={12} className="text-gray-500" />
                        <span className="text-xs text-gray-600">{day.wind_speed}km/h</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${getUvIndexColor(day.uv_index)}`}>
                        <Sun size={12} />
                        <span className="text-xs">{day.uv_index}</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Pressure: {day.pressure} hPa
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Extended View Toggle */}
        {!showExtended && (
          <div className="text-center mt-4">
            <button
              onClick={() => setShowExtended(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
            >
              Show detailed forecast
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Weather data provided by{' '}
            <a 
              href="https://openweathermap.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
            >
              OpenWeatherMap
              <ExternalLink size={12} className="ml-1" />
            </a>
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WeatherForecastWidget;