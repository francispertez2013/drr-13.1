import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../hooks/useNotifications';
import NotificationSystem from '../components/NotificationSystem';
import DatabaseSelector from '../components/DatabaseSelector';
import { 
  LayoutDashboard, 
  Newspaper, 
  Settings, 
  Users, 
  AlertTriangle, 
  Menu, 
  X, 
  LogOut,
  Shield,
  FileText,
  Info,
  Images,
  Share2,
  Siren,
  FolderOpen,
  Phone,
  Cloud,
  Play
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { notifications, removeNotification } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/emergency', icon: Siren, label: 'Emergency Alerts' },
    { path: '/admin/weather', icon: Cloud, label: 'Weather Management' },
    { path: '/admin/news', icon: Newspaper, label: 'News Management' },
    { path: '/admin/services', icon: Shield, label: 'Services' },
    { path: '/admin/about', icon: Info, label: 'About Page' },
    { path: '/admin/gallery', icon: Images, label: 'Gallery' },
    { path: '/admin/videos', icon: Play, label: 'Videos' },
    { path: '/admin/social', icon: Share2, label: 'Social Media' },
    { path: '/admin/pages', icon: FileText, label: 'Pages' },
    { path: '/admin/resources', icon: FolderOpen, label: 'Resources' },
    { path: '/admin/navigation', icon: Menu, label: 'Navigation' },
    { path: '/admin/incidents', icon: AlertTriangle, label: 'Incident Reports' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <NotificationSystem 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
      
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-950 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-blue-900">
          <div className="flex items-center space-x-3">
            <img 
              src="https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp" 
              alt="MDRRMO" 
              className="h-8 w-auto"
            />
            <div>
              <h1 className="text-yellow-500 font-bold text-sm">MDRRMO</h1>
              <p className="text-yellow-400 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-yellow-500 hover:text-yellow-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-yellow-500 border-r-4 border-yellow-500'
                    : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6">
          <div className="bg-blue-800 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-blue-950 font-bold text-sm">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-gray-300 text-xs">{user?.role}</p>
              </div>
            </div>
            
            {/* Database Selector */}
            <div className="mb-3">
              <DatabaseSelector />
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-blue-700 rounded transition-colors"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                target="_blank"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View Website
              </Link>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;