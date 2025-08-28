import React, { useEffect, useRef, useState } from 'react';
import { Phone, AlertTriangle, ChevronDown, CloudRain, Zap, Wind } from 'lucide-react';
import Navigation from './Navigation';
import WeatherTickerWidget from './WeatherTickerWidget';
import WeatherForecastWidget from './WeatherForecastWidget';
// import SmoothScroll from './SmoothScroll';

const Hero = ({ onEmergencyClick, onIncidentClick }) => {
  const rainContainerRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const lightningTimeoutsRef = useRef([]);
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    condition: 'Rainy',
    humidity: 85,
    windSpeed: 12
  });

  useEffect(() => {
    // Create rain effect
    const createRain = () => {
      const rainContainer = rainContainerRef.current;
      if (!rainContainer) return;

      rainContainer.innerHTML = '';
      const rainCount = 120;

      for (let i = 0; i < rainCount; i++) {
        const drop = document.createElement('div');
        drop.className = 'absolute w-px bg-gradient-to-b from-white/60 to-transparent rounded-full';
        
        const left = Math.random() * 100;
        const height = 20 + Math.random() * 50;
        const duration = 0.3 + Math.random() * 1.2;
        const delay = Math.random() * 2;
        const opacity = 0.3 + Math.random() * 0.7;

        drop.style.left = `${left}%`;
        drop.style.height = `${height}px`;
        drop.style.animation = `rainDrop ${duration}s linear infinite`;
        drop.style.animationDelay = `${delay}s`;
        drop.style.opacity = opacity;

        rainContainer.appendChild(drop);
      }
    };

    // Create lightning effect
    const createLightning = () => {
      const lightningFlash = document.createElement('div');
      lightningFlash.className = 'fixed inset-0 bg-white pointer-events-none z-20';
      lightningFlash.style.opacity = '0';
      document.body.appendChild(lightningFlash);

      // Flash effect
      lightningFlash.style.transition = 'opacity 0.15s';
      lightningFlash.style.opacity = '0.6';
      
      const timeout1 = setTimeout(() => {
        lightningFlash.style.opacity = '0';
        const timeout2 = setTimeout(() => {
          if (document.body.contains(lightningFlash)) {
            document.body.removeChild(lightningFlash);
          }
          lightningTimeoutsRef.current = lightningTimeoutsRef.current.filter(t => t !== timeout1 && t !== timeout2);
        }, 400);
        lightningTimeoutsRef.current.push(timeout2);
      }, 200);
      lightningTimeoutsRef.current.push(timeout1);
    };

    createRain();
    
    // Random lightning every 12-20 seconds
    const lightningInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        createLightning();
      }
    }, 12000 + Math.random() * 8000);

    // Simulate weather updates
    const weatherInterval = setInterval(() => {
      setWeatherData(prev => ({
        temperature: prev.temperature + (Math.random() > 0.5 ? 1 : -1),
        condition: Math.random() > 0.8 ? 'Thunderstorm' : 'Rainy',
        humidity: Math.min(100, Math.max(70, prev.humidity + (Math.random() > 0.5 ? 2 : -2))),
        windSpeed: Math.min(25, Math.max(5, prev.windSpeed + (Math.random() > 0.5 ? 1 : -1)))
      }));
    }, 10000);

    return () => {
      clearInterval(lightningInterval);
      clearInterval(weatherInterval);
      lightningTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      lightningTimeoutsRef.current = [];
      const lightningElements = document.querySelectorAll('.fixed.inset-0.bg-white.pointer-events-none.z-20');
      lightningElements.forEach(element => {
        if (document.body.contains(element)) {
          document.body.removeChild(element);
        }
      });
    };
  }, []);

  const handleScrollClick = () => {
    if (isScrolling) {
      setIsScrolling(false);
      return;
    }
    
    setIsScrolling(true);
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };

  return (
    <section id="home" className="relative h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative z-40">
        <Navigation />
      </div>

      {/* Hero Content Container */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-black"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dedcmctqk/image/upload/v1752394779/bg_ixkluh.jpg')"
          }}
        ></div>

        {/* Weather Overlay */}
        <div className="absolute top-4 right-4 z-30 bg-black/30 backdrop-blur-sm rounded-2xl p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <CloudRain className="mr-2" size={20} />
              <span className="text-lg font-bold">{weatherData.temperature}°C</span>
            </div>
            <div className="text-sm">
              <div>Humidity: {weatherData.humidity}%</div>
              <div>Wind: {weatherData.windSpeed} km/h</div>
            </div>
          </div>
        </div>

        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 z-20"></div>
        
        {/* Rain Effect */}
        <div ref={rainContainerRef} className="absolute inset-0 z-10"></div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 z-30 text-center">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight px-4">
              <span className="text-yellow-400 drop-shadow-2xl inline-block animate-pulse">
                Resilient Pio Duran:
              </span>
              <br />
              <span className="drop-shadow-2xl inline-block animate-fade-in-up">
                Prepared for Tomorrow
              </span>
            </h1>
            
            <p className="text-base md:text-xl lg:text-2xl text-white max-w-4xl mx-auto mb-8 md:mb-12 drop-shadow-lg leading-relaxed px-4 animate-fade-in-up delay-100">
              Building stronger communities through comprehensive disaster preparedness, 
              innovative response strategies, and unwavering commitment to public safety.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-8 mb-16 md:mb-20 px-4 animate-fade-in-up delay-200">
              <button
                onClick={onEmergencyClick}
                className="group inline-flex items-center px-8 md:px-14 py-5 md:py-7 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-full shadow-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-base md:text-xl"
              >
                <Phone className="mr-3 md:mr-4 group-hover:animate-pulse" size={24} />
                Emergency Hotline
                <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">911</span>
              </button>
              <button
                onClick={onIncidentClick}
                className="group inline-flex items-center px-8 md:px-14 py-5 md:py-7 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-950 font-bold rounded-full shadow-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-3xl active:scale-95 text-base md:text-xl"
              >
                <AlertTriangle className="mr-3 md:mr-4 group-hover:animate-pulse" size={24} />
                Report Incident
              </button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-12 animate-fade-in-up delay-300">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400">24/7</div>
                <div className="text-sm text-white">Monitoring</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400">8</div>
                <div className="text-sm text-white">Hazards Covered</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400">33</div>
                <div className="text-sm text-white">Protected Barangay</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-yellow-400">50K+</div>
                <div className="text-sm text-white">Populations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 md:bottom-12 left-0 right-0 flex justify-center z-30">
          <button
            onClick={handleScrollClick}
            className="text-white hover:text-yellow-400 transition-all duration-300 focus:outline-none transform hover:scale-110"
            aria-label="Scroll to next section"
          >
         {/*   <div className="bg-black/30 backdrop-blur-sm rounded-full p-4 border border-white/30 shadow-lg hover:shadow-xl hover:bg-black/40 transition-all duration-300">
              <ChevronDown className={`${isScrolling ? 'animate-spin' : 'animate-bounce'} hover:scale-110 transition-transform duration-200`} size={28} />
            </div> */}
          </button>
        </div>
      </div>
      
      {/* Weather Widgets */}
      <div className="relative z-50 weather-widgets-container">
        <WeatherTickerWidget />
        <WeatherForecastWidget />
      </div>
      
     {/*  <SmoothScroll isActive={isScrolling} onStop={() => setIsScrolling(false)} />  */}
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes rainDrop {
          0% {
            transform: translateY(-100vh);
          }
          100% {
            transform: translateY(100vh);
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .delay-100 {
          animation-delay: 0.1s;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        
        .delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;