import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EmergencyAlert {
  id: string;
  type: 'typhoon' | 'earthquake' | 'flood' | 'fire' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  issued_at: string;
}

const EmergencyAlertBanner: React.FC = () => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    fetchActiveAlerts();
  }, []);

  const fetchActiveAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
        .eq('status', 'active')
        .eq('show_on_frontend', true)
        .order('issued_at', { ascending: false });

      if (error && !error.message.includes('relation "emergency_alerts" does not exist')) {
        throw error;
      }
      
      const transformedData = (data || []).map(alert => ({
        id: alert.id,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        location: alert.location || 'Municipality-wide',
        issued_at: alert.issued_at
      }));
      
      setAlerts(transformedData);
    } catch (error) {
      console.error('Error fetching emergency alerts:', error);
    }
  };

  useEffect(() => {
    if (alerts.length > 1) {
      const interval = setInterval(() => {
        setCurrentAlertIndex((prev) => (prev + 1) % alerts.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-700 border-4 border-yellow-500';
      case 'high':
        return 'bg-orange-600 border-4 border-blue-600';
      case 'medium':
        return 'bg-yellow-500 border-4 border-yellow-900';
      case 'low':
        return 'bg-blue-700 border-4 border-yellow-500';
      default:
        return 'bg-green-700 border-4 border-orange-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'typhoon':
        return '🌪️';
      case 'earthquake':
        return '🌍';
      case 'flood':
        return '🌊';
      case 'fire':
        return '🔥';
      default:
        return '⚠️';
    }
  };

  if (!isVisible || alerts.length === 0) {
    return null;
  }

  const currentAlert = alerts[currentAlertIndex];

  return (
    <div className={`${getSeverityColor(currentAlert.severity)} text-white py-0 px-1 relative z-40`}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl animate-pulse">{getTypeIcon(currentAlert.type)}</span>
            <AlertTriangle className="animate-bounce" size={20} />
            <span className="font-bold text-sm">EMERGENCY ALERT:</span>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <span className="font-medium">{currentAlert.title}</span>
              <span className="mx-4">•</span>
              <span>{currentAlert.message}</span>
              <span className="mx-4">•</span>
              <span>Location: {currentAlert.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {alerts.length > 1 && (
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              {currentAlertIndex + 1} of {alerts.length}
            </div>
          )}
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-white hover:text-gray-200 transition-colors"
            title={isMuted ? 'Unmute alerts' : 'Mute alerts'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          
          <button
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gray-200 transition-colors"
            title="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlertBanner;