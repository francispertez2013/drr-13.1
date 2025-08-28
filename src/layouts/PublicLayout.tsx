import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import SkipToContent from '../components/SkipToContent';
import Navigation from '../components/Navigation';
import EmergencyAlertBanner from '../components/EmergencyAlertBanner';
import OfflineIndicator from '../components/OfflineIndicator';
import AccessibilityMenu from '../components/AccessibilityMenu';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';

const PublicLayout: React.FC = () => {
  const location = useLocation();

  // Don't show header/footer on home page since it has its own header
  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      <SkipToContent />
      <OfflineIndicator />
      <EmergencyAlertBanner />
      
      {!isHomePage && (
        <Navigation />
      )}
      
      <main id="main-content">
        <Outlet />
      </main>
      
      <Footer />
      <BackToTop />
      <AccessibilityMenu />
      <PWAInstallPrompt />
    </div>
  );
};

export default PublicLayout;