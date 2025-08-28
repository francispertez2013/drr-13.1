import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Eye, Download, Calendar } from 'lucide-react';

interface AnalyticsData {
  pageViews: { date: string; views: number }[];
  topPages: { page: string; views: number }[];
  downloads: { resource: string; count: number }[];
  userEngagement: {
    totalVisitors: number;
    avgSessionDuration: string;
    bounceRate: string;
    returnVisitors: string;
  };
}

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    pageViews: [
      { date: '2025-01-15', views: 245 },
      { date: '2025-01-16', views: 312 },
      { date: '2025-01-17', views: 189 },
      { date: '2025-01-18', views: 423 },
      { date: '2025-01-19', views: 356 },
      { date: '2025-01-20', views: 298 },
      { date: '2025-01-21', views: 467 }
    ],
    topPages: [
      { page: 'Home', views: 1234 },
      { page: 'Emergency Procedures', views: 892 },
      { page: 'News Portal', views: 756 },
      { page: 'Resources', views: 634 },
      { page: 'About', views: 523 }
    ],
    downloads: [
      { resource: 'Emergency Kit Checklist', count: 156 },
      { resource: 'Family Disaster Plan', count: 134 },
      { resource: 'Evacuation Routes Map', count: 98 },
      { resource: 'First Aid Guide', count: 87 },
      { resource: 'Typhoon Preparedness', count: 76 }
    ],
    userEngagement: {
      totalVisitors: 2847,
      avgSessionDuration: '3:42',
      bounceRate: '34.2%',
      returnVisitors: '42.8%'
    }
  });

  const [timeRange, setTimeRange] = useState('7d');

  const totalViews = analyticsData.pageViews.reduce((sum, day) => sum + day.views, 0);
  const avgDailyViews = Math.round(totalViews / analyticsData.pageViews.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Overview</h2>
          <p className="text-gray-600">Website performance and user engagement metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+12.5%</span>
            <span className="text-sm text-gray-500 ml-1">from last week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Daily Views</p>
              <p className="text-3xl font-bold text-gray-900">{avgDailyViews}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Visitors</p>
              <p className="text-3xl font-bold text-gray-900">{analyticsData.userEngagement.totalVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Downloads</p>
              <p className="text-3xl font-bold text-gray-900">
                {analyticsData.downloads.reduce((sum, item) => sum + item.count, 0)}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Download className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Page Views</h3>
          <div className="h-64 flex items-end space-x-2">
            {analyticsData.pageViews.map((day, index) => {
              const maxViews = Math.max(...analyticsData.pageViews.map(d => d.views));
              const height = (day.views / maxViews) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                    title={`${day.views} views on ${new Date(day.date).toLocaleDateString()}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-3">
            {analyticsData.topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{page.page}</span>
                </div>
                <span className="text-sm text-gray-600">{page.views.toLocaleString()} views</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Engagement */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {analyticsData.userEngagement.avgSessionDuration}
            </div>
            <div className="text-sm text-gray-600">Avg Session Duration</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {analyticsData.userEngagement.bounceRate}
            </div>
            <div className="text-sm text-gray-600">Bounce Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {analyticsData.userEngagement.returnVisitors}
            </div>
            <div className="text-sm text-gray-600">Return Visitors</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {analyticsData.downloads.reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;