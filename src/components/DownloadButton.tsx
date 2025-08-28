import React from 'react';
import { Download, CheckCircle, AlertTriangle, Loader, ExternalLink } from 'lucide-react';
import { useDownload } from '../hooks/useDownload';
import { usePages } from '../contexts/PagesContext';
import ModernButton from './ModernButton';

interface DownloadButtonProps {
  resourceId: string;
  resourceTitle: string;
  fileUrl: string;
  filename?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  fallbackUrl?: string;
  className?: string;
  children?: React.ReactNode;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  resourceId,
  resourceTitle,
  fileUrl,
  filename,
  variant = 'primary',
  size = 'md',
  showProgress = true,
  fallbackUrl,
  className = '',
  children
}) => {
  const { isDownloading, progress, error, success, download } = useDownload();
  const { incrementDownload } = usePages();

  const handleDownload = async () => {
    try {
      // Increment download count in database
      await incrementDownload(resourceId);
      
      // Start download
      await download(fileUrl, resourceId, resourceTitle, {
        filename: filename || `${resourceTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`,
        fallbackUrl,
        onError: (error) => {
          console.error('Download error:', error);
          
          // Show user-friendly error message
          const shouldTryFallback = window.confirm(
            'Download failed. Would you like to try an alternative method?'
          );
          
          if (shouldTryFallback) {
            window.open(fileUrl, '_blank');
          }
        }
      });
    } catch (error) {
      console.error('Error initiating download:', error);
    }
  };

  const getButtonContent = () => {
    if (children) return children;
    
    if (isDownloading) {
      return (
        <>
          <Loader className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Downloading...</span>
          {showProgress && <span>({Math.round(progress)}%)</span>}
        </>
      );
    }
    
    if (success) {
      return (
        <>
          <CheckCircle size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Downloaded!</span>
        </>
      );
    }
    
    if (error) {
      return (
        <>
          <AlertTriangle size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
          <span>Retry</span>
        </>
      );
    }
    
    return (
      <>
        <Download size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        <span>Download</span>
      </>
    );
  };

  const getButtonVariant = () => {
    if (success) return 'success';
    if (error) return 'danger';
    return variant;
  };

  return (
    <div className={`relative ${className}`}>
      <ModernButton
        onClick={handleDownload}
        disabled={isDownloading}
        variant={getButtonVariant()}
        size={size}
        className="relative overflow-hidden"
      >
        {getButtonContent()}
      </ModernButton>
      
      {/* Progress bar overlay */}
      {isDownloading && showProgress && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Error tooltip */}
      {error && (
        <div className="absolute top-full left-0 mt-2 bg-red-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
          {error}
          <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-red-600"></div>
        </div>
      )}
    </div>
  );
};

export default DownloadButton;