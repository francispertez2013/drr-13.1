import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Download, Eye, Calendar, Users, FileText, Star } from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import ModernCard from './ModernCard';

interface ResourceAnalytics {
  totalResources: number;
  totalDownloads: number;
  avgDownloadsPerResource: number;
  topCategories: Array<{ category: string; count: number; downloads: number }>;
  topResources: Array<{ id: string; title: string; downloads: number; category: string }>;
  downloadTrends: Array<{ date: string; downloads: number }>;
  categoryDistribution: Array<{ category: string; percentage: number; count: number }>;
}

const ResourceAnalytics: React.FC = () => {
  const { resources } = usePages();
  const [analytics, setAnalytics] = useState<ResourceAnalytics | null>(null);
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalytics();
  }, [resources, timeRange]);

  const generateAnalytics = () => {
    try {
      setLoading(true);
      
      const publishedResources = resources.filter(r => r.status === 'published');
      const totalDownloads = publishedResources.reduce((sum, r) => sum + r.download_count, 0);
      
      // Category analysis
      const categoryStats = new Map<string, { count: number; downloads: number }>();
      publishedResources.forEach(resource => {
        const existing = categoryStats.get(resource.category) || { count: 0, downloads: 0 };
        categoryStats.set(resource.category, {
          count: existing.count + 1,
          downloads: existing.downloads + resource.download_count
        });
      });
      
      const topCategories = Array.from(categoryStats.entries())
        .map(([category, stats]) => ({ category, ...stats }))
        .sort((a, b) => b.downloads - a.downloads);
      
      // Top resources
      const topResources = publishedResources
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 10)
        .map(r => ({
          id: r.id,
          title: r.title,
          downloads: r.download_count,
          category: r.category
        }));
      
      // Category distribution
      const categoryDistribution = topCategories.map(cat => ({
        category: cat.category,
        count: cat.count,
        percentage: Math.round((cat.count / publishedResources.length) * 100)
      }));
      
      // Mock download trends (in production, this would come from actual analytics)
      const downloadTrends = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          downloads: Math.floor(Math.random() * 50) + 10
        };
      });
      
      setAnalytics({
        totalResources: publishedResources.length,
        totalDownloads,
        avgDownloadsPerResource: publishedResources.length > 0 
          ? Math.round(totalDownloads / publishedResources.length) 
          : 0,
        topCategories,
        topResources,
        downloadTrends,
        categoryDistribution
      });
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6">
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
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ModernCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Resources</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalResources}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalDownloads.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+25%</span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Downloads</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.avgDownloadsPerResource}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-500">per resource</span>
          </div>
        </ModernCard>

        <ModernCard variant="glass" className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured Items</p>
              <p className="text-3xl font-bold text-gray-900">
                {resources.filter(r => r.featured).length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </ModernCard>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Download Trends */}
        <ModernCard variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Download Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {analytics.downloadTrends.map((day, index) => {
              const maxDownloads = Math.max(...analytics.downloadTrends.map(d => d.downloads));
              const height = (day.downloads / maxDownloads) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${day.downloads} downloads on ${new Date(day.date).toLocaleDateString()}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </ModernCard>

        {/* Category Distribution */}
        <ModernCard variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analytics.categoryDistribution.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900 capitalize">{category.category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{category.count} items</span>
                  <span className="text-sm font-medium text-gray-900">{category.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </ModernCard>
      </div>

      {/* Top Resources */}
      <ModernCard variant="glass" className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Downloaded Resources</h3>
        <div className="space-y-3">
          {analytics.topResources.slice(0, 5).map((resource, index) => (
            <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">{resource.title}</h4>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded capitalize">
                    {resource.category}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-600">{resource.downloads}</span>
                <p className="text-xs text-gray-500">downloads</p>
              </div>
            </div>
          ))}
        </div>
      </ModernCard>
    </div>
  );
};

export default ResourceAnalytics;