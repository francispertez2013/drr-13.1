import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  AlertTriangle, 
  Zap, 
  Bell, 
  Settings, 
  Activity,
  Send,
  Clock,
  Users,
  TrendingUp,
  Plus,
  X
} from 'lucide-react';

interface EmergencyAlert {
  id: string;
  type: 'typhoon' | 'earthquake' | 'flood' | 'fire' | 'landslide' | 'tsunami' | 'general';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  location: string;
  issued_at: string;
  status: 'draft' | 'active' | 'expired' | 'cancelled';
  channels: string[];
  priority: 1 | 2 | 3 | 4 | 5;
  show_on_frontend: boolean;
}

const EmergencyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'alerts' | 'create' | 'history' | 'settings'>('alerts');
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [newAlert, setNewAlert] = useState<Partial<EmergencyAlert>>({
    type: 'general',
    severity: 'medium',
    title: '',
    message: '',
    location: '',
    channels: ['social-media'],
    priority: 3,
    show_on_frontend: true
  });

  React.useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_alerts')
        .select('*')
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
        issued_at: alert.issued_at,
        status: alert.status,
        channels: alert.channels || ['social-media'],
        priority: alert.priority || 3,
        show_on_frontend: alert.show_on_frontend !== false
      }));
      
      setAlerts(transformedData);
    } catch (error) {
      console.error('Error fetching emergency alerts:', error);
    } finally {
      setLoading(false);
    }
  };
  const emergencyStats = {
    activeAlerts: alerts.filter(a => a.status === 'active').length,
    totalSent: 156,
    avgResponseTime: '3.2 min',
    reachRate: '94.8%'
  };

  const alertTypes = [
    { id: 'typhoon', name: 'Typhoon/Storm', icon: '🌪️', color: 'bg-purple-500' },
    { id: 'earthquake', name: 'Earthquake', icon: '🌍', color: 'bg-red-600' },
    { id: 'flood', name: 'Flood', icon: '🌊', color: 'bg-blue-600' },
    { id: 'fire', name: 'Fire', icon: '🔥', color: 'bg-orange-600' },
    { id: 'landslide', name: 'Landslide', icon: '⛰️', color: 'bg-amber-600' },
    { id: 'tsunami', name: 'Tsunami', icon: '🌊', color: 'bg-blue-800' },
    { id: 'general', name: 'General Alert', icon: '⚠️', color: 'bg-gray-600' }
  ];

  const severityLevels = [
    { id: 'low', name: 'Advisory', color: 'bg-green-500' },
    { id: 'medium', name: 'Watch', color: 'bg-yellow-500' },
    { id: 'high', name: 'Warning', color: 'bg-orange-500' },
    { id: 'critical', name: 'Emergency', color: 'bg-red-600 border-4 border-yello-500' }
  ];

  const handleCreateAlert = () => {
    if (!newAlert.title || !newAlert.message) {
      alert('Please fill in all required fields');
      return;
    }

    const createAlert = async () => {
      try {
        const { data, error } = await supabase
          .from('emergency_alerts')
          .insert([{
            type: newAlert.type,
            severity: newAlert.severity,
            title: newAlert.title,
            message: newAlert.message,
            location: newAlert.location || 'Municipality-wide',
            status: 'active',
            channels: newAlert.channels || ['social-media'],
            priority: newAlert.priority || 3,
            show_on_frontend: newAlert.show_on_frontend !== false
          }])
          .select()
          .single();

        if (error) throw error;
        
        const transformedAlert = {
          id: data.id,
          type: data.type,
          severity: data.severity,
          title: data.title,
          message: data.message,
          location: data.location,
          issued_at: data.issued_at,
          status: data.status,
          channels: data.channels,
          priority: data.priority,
          show_on_frontend: data.show_on_frontend
        };

        setAlerts(prev => [transformedAlert, ...prev]);
        setNewAlert({
          type: 'general',
          severity: 'medium',
          title: '',
          message: '',
          location: '',
          channels: ['social-media'],
          priority: 3,
          show_on_frontend: true
        });
        setIsCreating(false);
        alert('Emergency alert created successfully!');
      } catch (error) {
        console.error('Error creating alert:', error);
        alert('Error creating alert. Please try again.');
      }
    };

    createAlert();
  };

  const handleCancelAlert = async (alertId: string) => {
    if (window.confirm('Are you sure you want to cancel this alert?')) {
      try {
        const { error } = await supabase
          .from('emergency_alerts')
          .update({ status: 'cancelled' })
          .eq('id', alertId);

        if (error) throw error;
        
        setAlerts(prev => prev.map(a => 
          a.id === alertId ? { ...a, status: 'cancelled' } : a
        ));
        alert('Alert cancelled successfully!');
      } catch (error) {
        console.error('Error cancelling alert:', error);
        alert('Error cancelling alert. Please try again.');
      }
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Management</h1>
          <p className="text-gray-600">Emergency alert system and monitoring</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Alert</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-gray-900">{emergencyStats.activeAlerts}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Bell className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alerts Sent</p>
              <p className="text-3xl font-bold text-gray-900">{emergencyStats.totalSent}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Send className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Time</p>
              <p className="text-3xl font-bold text-gray-900">{emergencyStats.avgResponseTime}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reach Rate</p>
              <p className="text-3xl font-bold text-gray-900">{emergencyStats.reachRate}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Active Emergency Alerts</h3>
        </div>
        <div className="p-6">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-500">All clear! No emergency alerts are currently active.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map((alert) => {
                const typeConfig = alertTypes.find(t => t.id === alert.type);
                const severityConfig = severityLevels.find(s => s.id === alert.severity);
                
                return (
                  <div key={alert.id} className="border border-red-200 rounded-lg p-6 bg-red-50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`${typeConfig?.color} text-white p-2 rounded-lg text-lg`}>
                          {typeConfig?.icon}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                            <span className={`${severityConfig?.color} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                              {severityConfig?.name}
                            </span>
                            {alert.show_on_frontend && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Public
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{alert.location}</span>
                            <span>{formatTimeAgo(alert.issued_at)}</span>
                            <span>Priority: {alert.priority}/5</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelAlert(alert.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Cancel Alert"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{alert.message}</p>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Channels:</span>
                      {alert.channels.map((channel, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Alert Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Create Emergency Alert</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Alert Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alert Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {alertTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setNewAlert({ ...newAlert, type: type.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newAlert.type === type.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{type.icon}</div>
                      <div className="text-xs font-medium">{type.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Severity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity Level</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {severityLevels.map((severity) => (
                    <button
                      key={severity.id}
                      type="button"
                      onClick={() => setNewAlert({ ...newAlert, severity: severity.id as any })}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        newAlert.severity === severity.id
                          ? 'border-red-800 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${severity.color} mx-auto mb-1`}></div>
                      <div className="text-xs font-medium">{severity.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Title</label>
                <input
                  type="text"
                  value={newAlert.title || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Brief, clear title for the alert"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alert Message</label>
                <textarea
                  value={newAlert.message || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Detailed information about the emergency"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Affected Area</label>
                <input
                  type="text"
                  value={newAlert.location || ''}
                  onChange={(e) => setNewAlert({ ...newAlert, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Specific location or 'Municipality-wide'"
                />
              </div>

              {/* Show on Frontend */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newAlert.show_on_frontend !== false}
                    onChange={(e) => setNewAlert({ ...newAlert, show_on_frontend: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Show on Frontend</span>
                </label>
                <p className="text-xs text-gray-500 ml-6">Display this alert on the public website</p>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateAlert}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <AlertTriangle size={16} />
                  <span>Create Alert</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyManagement;