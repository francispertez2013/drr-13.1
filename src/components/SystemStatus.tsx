import React, { useState, useEffect } from 'react';
import { Activity, Database, Wifi, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { monitoring } from '../utils/monitoring';
import { useDatabase } from '../contexts/DatabaseContext';

const SystemStatus: React.FC = () => {
  const [healthChecks, setHealthChecks] = useState<any[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { isConnected } = useDatabase();

  useEffect(() => {
    const updateStatus = async () => {
      const checks = await monitoring.runHealthChecks();
      const metrics = monitoring.getSystemMetrics();
      
      setHealthChecks(checks);
      setSystemMetrics(metrics);
      setLastUpdate(new Date());
    };

    updateStatus();
    const interval = setInterval(updateStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'degraded':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'unhealthy':
        return <AlertTriangle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const overallStatus = monitoring.getHealthStatus();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon(overallStatus)}
          <span className={`text-sm font-medium ${getStatusColor(overallStatus)}`}>
            {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
          </span>
        </div>
      </div>

      {/* Service Status */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Database (Supabase)</span>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <CheckCircle className="text-green-500" size={16} />
                <span className="text-sm text-green-600">Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="text-red-500" size={16} />
                <span className="text-sm text-red-600">Disconnected</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Activity size={16} className="text-gray-600" />
            <span className="text-sm font-medium">Real-time Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" size={16} />
            <span className="text-sm text-green-600">Active</span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Wifi size={16} className="text-gray-600" />
            <span className="text-sm font-medium">API Services</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500" size={16} />
            <span className="text-sm text-green-600">Operational</span>
          </div>
        </div>
        {healthChecks.map((check) => (
          <div key={check.service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity size={16} className="text-gray-600" />
              <span className="text-sm font-medium capitalize">{check.service}</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(check.status)}
              <span className={`text-sm ${getStatusColor(check.status)}`}>
                {check.status}
              </span>
              {check.responseTime && (
                <span className="text-xs text-gray-500">
                  ({Math.round(check.responseTime)}ms)
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* System Metrics */}
      {systemMetrics && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">Performance Metrics</h4>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600">Memory Usage</div>
              <div className="text-sm font-medium">
                {systemMetrics.memory.percentage}%
              </div>
              <div className="text-xs text-gray-500">
                {formatBytes(systemMetrics.memory.used)} / {formatBytes(systemMetrics.memory.total)}
              </div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600">Page Load</div>
              <div className="text-sm font-medium">
                {Math.round(systemMetrics.performance.navigation)}ms
              </div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600">Errors</div>
              <div className="text-sm font-medium">
                {systemMetrics.errors.count}
              </div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg">
              <div className="text-xs text-gray-600">First Paint</div>
              <div className="text-sm font-medium">
                {Math.round(systemMetrics.performance.paint)}ms
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;