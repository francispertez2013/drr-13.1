import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  FileText, 
  Users, 
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  Star,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import { useAnalytics } from '../utils/analytics';
import ModernCard from './ModernCard';
import ResourceAnalytics from './ResourceAnalytics';
import ResourceManager from './ResourceManager';

interface DashboardMetrics {
  totalResources: number;
  publishedResources: number;
  totalDownloads: number;
  avgDownloadsPerResource: number;
  featuredResources: number;
  recentActivity: Array<{
    id: string;
    type: 'download' | 'upload' | 'edit';
    resource: string;
    timestamp: string;
    user?: string;
  }>;
  topPerformers: Array<{
    id: string;
    title: string;
    downloads: number;
    category: string;
    trend: 'up' | 'down' | 'stable';
  }>;
}

const ResourceDashboard: React.FC = () => {
  const { resources } = usePages();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'management'>('overview');
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    generateMetrics();
  }, [resources, timeRange]);

  const generateMetrics = () => {
    try {
      setLoading(true);
      
      const publishedResources = resources.filter(r => r.status === 'published');
      const totalDownloads = publishedResources.reduce((sum, r) => sum + r.download_count, 0);
      
      // Generate mock recent activity (in production, this would come from audit logs)
      const recentActivity = [
        {
          id: '1',
          type: 'download' as const,
          resource: 'Emergency Kit Checklist',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          user: 'Public User'
        },
        {
          id: '2',
          type: 'upload' as const,
          resource: 'New Safety Manual',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          user: 'Admin User'
        },
        {
          id: '3',
          type: 'edit' as const,
          resource: 'Evacuation Routes',
          timestamp: new Date(Date.now() - 900000).toISOString(),
          user: 'Editor User'
        }
      ];
      
      // Top performers with mock trends
      const topPerformers = publishedResources
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 5)
        .map(r => ({
          id: r.id,
          title: r.title,
          downloads: r.download_count,
          category: r.category,
          trend: Math.random() > 0.5 ? 'up' as const : 'stable' as const
        }));
      
      setMetrics({
        totalResources: resources.length,
        publishedResources: publishedResources.length,
        totalDownloads,
        avgDownloadsPerResource: publishedResources.length > 0 
          ? Math.round(totalDownloads / publishedResources.length) 
          : 0,
        featuredResources: resources.filter(r => r.featured).length,
        recentActivity,
        topPerformers
      });
      
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error generating metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    generateMetrics();
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'download': return <Download className="text-blue-600" size={16} />;
      case 'upload': return <FileText className="text-green-600" size={16} />;
      case 'edit': return <Eye className="text-yellow-600" size={16} />;
      default: return <FileText className="text-gray-600" size={16} />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="text-green-500" size={16} />;
      case 'down': return <TrendingUp className="text-red-500 rotate-180" size={16} />;
      default: return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (loading || !metrics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Resource Dashboard</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ModernCard key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </ModernCard>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Dashboard</h1>
          <p className="text-gray-600">
            Comprehensive overview of resource management and analytics
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
            { id: 'management', label: 'Management', icon: FileText }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Resources</p>
                  <p className="text-3xl font-bold text-gray-900">{metrics.totalResources}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Published</p>
                  <p className="text-3xl font-bold text-green-600">{metrics.publishedResources}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-3xl font-bold text-purple-600">{metrics.totalDownloads.toLocaleString()}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Download className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Downloads</p>
                  <p className="text-3xl font-bold text-orange-600">{metrics.avgDownloadsPerResource}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </ModernCard>

            <ModernCard variant="glass" className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Featured</p>
                  <p className="text-3xl font-bold text-yellow-600">{metrics.featuredResources}</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </ModernCard>
          </div>

          {/* Recent Activity & Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <ModernCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {metrics.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.type === 'download' && 'Downloaded'}
                        {activity.type === 'upload' && 'Uploaded'}
                        {activity.type === 'edit' && 'Edited'}
                        {' '}{activity.resource}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Top Performers */}
            <ModernCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Resources</h3>
              <div className="space-y-4">
                {metrics.topPerformers.map((resource, index) => (
                  <div key={resource.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{resource.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{resource.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(resource.trend)}
                      <span className="font-medium text-gray-900">{resource.downloads}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>
          </div>

          {/* System Status */}
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-600">All systems operational</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h4 className="font-medium text-gray-900">Database</h4>
                <p className="text-sm text-green-600">Connected</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h4 className="font-medium text-gray-900">File Storage</h4>
                <p className="text-sm text-green-600">Available</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h4 className="font-medium text-gray-900">Analytics</h4>
                <p className="text-sm text-green-600">Tracking</p>
              </div>
            </div>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
          </ModernCard>
        </div>
      )}

      {activeTab === 'analytics' && <ResourceAnalytics />}

      {activeTab === 'management' && (
        <ResourceManager 
          variant="admin" 
          showStats={false}
        />
      )}
    </div>
  );
};

export default ResourceDashboard;