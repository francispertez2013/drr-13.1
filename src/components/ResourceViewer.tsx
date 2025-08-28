import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Eye, 
  Share2, 
  Calendar, 
  Tag, 
  FileText, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Star,
  BarChart3
} from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import { useAnalytics } from '../utils/analytics';
import { formatFileSize } from '../utils/validation';
import type { Resource } from '../types';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import SocialShareButtons from './SocialShareButtons';

interface ResourceViewerProps {
  resourceId?: string;
  resource?: Resource;
  onClose?: () => void;
  showRelated?: boolean;
  embedded?: boolean;
}

const ResourceViewer: React.FC<ResourceViewerProps> = ({
  resourceId,
  resource: propResource,
  onClose,
  showRelated = true,
  embedded = false
}) => {
  const { resources, incrementDownload } = usePages();
  const { trackDownload } = useAnalytics();
  
  const [resource, setResource] = useState<Resource | null>(propResource || null);
  const [relatedResources, setRelatedResources] = useState<Resource[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (resourceId && !propResource) {
      const foundResource = resources.find(r => r.id === resourceId);
      setResource(foundResource || null);
    }
  }, [resourceId, propResource, resources]);

  useEffect(() => {
    if (resource && showRelated) {
      // Find related resources based on category and tags
      const related = resources
        .filter(r => 
          r.id !== resource.id && 
          r.status === 'published' &&
          (r.category === resource.category || 
           r.tags.some(tag => resource.tags.includes(tag)))
        )
        .sort((a, b) => b.download_count - a.download_count)
        .slice(0, 4);
      
      setRelatedResources(related);
    }
  }, [resource, resources, showRelated]);

  const handleDownload = async () => {
    if (!resource) return;
    
    try {
      setIsDownloading(true);
      
      // Track download
      trackDownload(resource.id, resource.title);
      
      // Increment download count
      await incrementDownload(resource.id);
      
      // Create download link
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.${resource.file_type}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again or contact support.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share && resource) {
      navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      guide: 'bg-blue-100 text-blue-800',
      form: 'bg-green-100 text-green-800',
      map: 'bg-red-100 text-red-800',
      report: 'bg-purple-100 text-purple-800',
      plan: 'bg-yellow-100 text-yellow-800',
      manual: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.manual;
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'image': return '🖼️';
      case 'video': return '🎥';
      default: return '📄';
    }
  };

  if (!resource) {
    return (
      <ModernCard className="p-12 text-center">
        <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Resource Not Found</h3>
        <p className="text-gray-600">The requested resource could not be found.</p>
      </ModernCard>
    );
  }

  const containerClass = embedded 
    ? "space-y-6" 
    : "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4";

  const contentClass = embedded
    ? ""
    : "bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto";

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {!embedded && (
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Resource Details</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        )}
        
        <div className="p-6 space-y-8">
          {/* Resource Header */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                <span className="text-lg">{getFileTypeIcon(resource.file_type)}</span>
                <span className="text-sm text-gray-500 uppercase">{resource.file_type}</span>
                {resource.featured && (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm flex items-center">
                    <Star size={12} className="mr-1" />
                    Featured
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{resource.title}</h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">{resource.description}</p>
              
              {resource.subcategory && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-600">Subcategory: </span>
                  <span className="text-sm text-gray-900">{resource.subcategory}</span>
                </div>
              )}
              
              {resource.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {resource.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:w-80">
              <ModernCard variant="gradient" className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Info</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Downloads</span>
                    <span className="font-medium text-gray-900">{resource.download_count}</span>
                  </div>
                  
                  {resource.file_size && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Size</span>
                      <span className="font-medium text-gray-900">{formatFileSize(resource.file_size)}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Type</span>
                    <span className="font-medium text-gray-900 uppercase">{resource.file_type}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Added</span>
                    <span className="font-medium text-gray-900">
                      {new Date(resource.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <ModernButton
                    onClick={handleDownload}
                    disabled={isDownloading}
                    loading={isDownloading}
                    icon={downloadSuccess ? CheckCircle : Download}
                    variant={downloadSuccess ? "success" : "primary"}
                    size="lg"
                    fullWidth
                    glow
                  >
                    {downloadSuccess ? 'Downloaded!' : 'Download Resource'}
                  </ModernButton>
                  
                  <div className="flex space-x-2">
                    <ModernButton
                      onClick={() => window.open(resource.file_url, '_blank')}
                      icon={ExternalLink}
                      variant="ghost"
                      size="sm"
                      fullWidth
                    >
                      Open in New Tab
                    </ModernButton>
                    
                    <ModernButton
                      onClick={handleShare}
                      icon={Share2}
                      variant="ghost"
                      size="sm"
                      fullWidth
                    >
                      Share
                    </ModernButton>
                  </div>
                </div>
              </ModernCard>
            </div>
          </div>

          {/* Social Share */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Share this resource</h4>
            <SocialShareButtons
              url={`${window.location.origin}/resources/${resource.id}`}
              title={resource.title}
              description={resource.description}
              hashtags={['MDRRMO', 'Resources', ...resource.tags.slice(0, 3)]}
            />
          </div>

          {/* Related Resources */}
          {showRelated && relatedResources.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Related Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedResources.map((relatedResource) => (
                  <ModernCard key={relatedResource.id} variant="interactive" className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-lg">{getFileTypeIcon(relatedResource.file_type)}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{relatedResource.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{relatedResource.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(relatedResource.category)}`}>
                            {relatedResource.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {relatedResource.download_count} downloads
                          </span>
                        </div>
                      </div>
                    </div>
                  </ModernCard>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceViewer;