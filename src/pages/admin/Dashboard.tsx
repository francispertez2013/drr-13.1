import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';
import { usePages } from '../../contexts/PagesContext';
import { useAuth } from '../../contexts/AuthContext';
//import WeatherWidget from '../../components/WeatherWidget';
import Analytics from '../../components/Analytics';
import SocialMediaFeed from '../../components/SocialMediaFeed';
import SystemStatus from '../../components/SystemStatus';
import { 
  Newspaper, 
  Shield, 
  AlertTriangle, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  Activity,
  BarChart3
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { news, services, incidents } = useData();
  const { pages, resources } = usePages();
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total News Articles',
      value: news.length,
      icon: Newspaper,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Published Pages',
      value: pages.filter(p => p.status === 'published').length,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Total Resources',
      value: resources.length,
      icon: Download,
      color: 'bg-green-500',
      change: '+15%'
    },
    {
      title: 'Pending Reports',
      value: incidents.filter(i => i.status === 'pending').length,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-3%'
    }
  ];

  const recentIncidents = incidents.slice(0, 5);
  const recentNews = news.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name || 'Admin'}! Here's your MDRRMO overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Widget */}
        {/*<WeatherWidget />*/}

        {/* System Status */}
        <SystemStatus />

        {/* Recent Incident Reports */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Incident Reports</h2>
          </div>
          <div className="p-6">
            {recentIncidents.length > 0 ? (
              <div className="space-y-4">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{incident.incident_type}</h3>
                      <p className="text-sm text-gray-600">{incident.location}</p>
                      <p className="text-xs text-gray-500">{incident.reference_number}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        incident.urgency === 'HIGH' ? 'bg-red-100 text-red-800' :
                        incident.urgency === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {incident.urgency}
                      </span>
                      {incident.status === 'pending' && <Clock className="h-4 w-4 text-yellow-500" />}
                      {incident.status === 'resolved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {incident.status === 'in-progress' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No incident reports yet</p>
            )}
          </div>
        </div>

        {/* Social Media Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Social Activity</h2>
          </div>
          <div className="p-6">
            <SocialMediaFeed maxPosts={3} showEngagement={false} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Pages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Popular Pages</h2>
            </div>
            <div className="p-6">
              {pages.length > 0 ? (
                <div className="space-y-4">
                  {pages
                    .filter(page => page.status === 'published')
                    .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
                    .slice(0, 5)
                    .map((page) => (
                    <div key={page.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        <p className="text-sm text-gray-600">/{page.slug}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{page.view_count || 0} views</p>
                        <p className="text-xs text-gray-500">{page.template}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No pages created yet</p>
              )}
            </div>
          </div>
          {/* Top Downloads */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Downloads</h2>
            </div>
            <div className="p-6">
              {resources.length > 0 ? (
                <div className="space-y-4">
                  {resources
                    .filter(resource => resource.status === 'published')
                    .sort((a, b) => b.download_count - a.download_count)
                    .slice(0, 5)
                    .map((resource) => (
                    <div key={resource.id} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2">{resource.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {resource.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {resource.download_count} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No resources yet</p>
              )}
            </div>
          </div>
        </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/admin/pages" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left block">
            <FileText className="h-8 w-8 text-purple-500 mb-2" />
            <h3 className="font-medium text-gray-900">Create New Page</h3>
            <p className="text-sm text-gray-600">Add a new dynamic page</p>
          </Link>
          <Link to="/admin/resources" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left block">
            <Download className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900">Add Resource</h3>
            <p className="text-sm text-gray-600">Upload new document</p>
          </Link>
          <Link to="/admin/incidents" className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-left block">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <h3 className="font-medium text-gray-900">Review Reports</h3>
            <p className="text-sm text-gray-600">Check incident reports</p>
          </Link>
        </div>
      </div>

      {/* Analytics Section */}
      <Analytics />
    </div>
  );
};

export default Dashboard;