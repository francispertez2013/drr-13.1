import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { PagesProvider } from './contexts/PagesContext';

// Public Pages
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import NewsPage from './pages/public/NewsPage';
import ResourcesPage from './pages/public/ResourcesPage';
import DisasterPlanPage from './pages/public/DisasterPlanPage';
import Contact from './pages/public/Contact';
import Gallery from './pages/public/Gallery';
import DynamicPage from './pages/public/DynamicPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import NewsManagement from './pages/admin/NewsManagement';
import ServicesManagement from './pages/admin/ServicesManagement';
import AboutManagement from './pages/admin/AboutManagement';
import GalleryManagement from './pages/admin/GalleryManagement';
import SocialMediaManagement from './pages/admin/SocialMediaManagement';
import EmergencyManagement from './pages/admin/EmergencyManagement';
import EmergencyHotlineManagement from './pages/admin/EmergencyHotlineManagement';
import PagesManagement from './pages/admin/PagesManagement';
import ResourcesManagement from './pages/admin/ResourcesManagement';
import NavigationManagement from './pages/admin/NavigationManagement';
import UsersManagement from './pages/admin/UsersManagement';
import IncidentReports from './pages/admin/IncidentReports';
import Settings from './pages/admin/Settings';
// import WeatherManagement from './pages/admin/WeatherManagement';
import VideoGallery from './pages/public/VideoGallery';
import VideoManagement from './pages/admin/VideoManagement';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <ErrorBoundary>
    <DatabaseProvider>
      <AuthProvider>
        <DataProvider>
          <PagesProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="services-detail" element={<ServicesPage />} />
                  <Route path="news-portal" element={<NewsPage />} />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="disaster-planning" element={<DisasterPlanPage />} />
                  <Route path="gallery" element={<Gallery />} />
                  <Route path="video-gallery" element={<VideoGallery />} />
                  <Route path="contact" element={<Contact />} />
                  {/* Dynamic pages route */}
                  <Route path=":slug" element={<DynamicPage />} />
                </Route>

                {/* Admin Login */}
                <Route path="/admin/login" element={<Login />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="emergency" element={<EmergencyManagement />} />
                {/*  <Route path="weather" element={<WeatherManagement />} /> */}
                  <Route path="hotlines" element={<EmergencyHotlineManagement />} />
                  <Route path="news" element={<NewsManagement />} />
                  <Route path="services" element={<ServicesManagement />} />
                  <Route path="about" element={<AboutManagement />} />
                  <Route path="gallery" element={<GalleryManagement />} />
                  <Route path="videos" element={<VideoManagement />} />
                  <Route path="social" element={<SocialMediaManagement />} />
                  <Route path="pages" element={<PagesManagement />} />
                  <Route path="resources" element={<ResourcesManagement />} />
                  <Route path="navigation" element={<NavigationManagement />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="incidents" element={<IncidentReports />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Router>
          </PagesProvider>
        </DataProvider>
      </AuthProvider>
    </DatabaseProvider>
    </ErrorBoundary>
  );
}

export default App;