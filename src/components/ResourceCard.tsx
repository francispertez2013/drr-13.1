import React from 'react';
import { 
  FileText, 
  Calendar, 
  Tag, 
  Eye, 
  Edit, 
  Trash2, 
  Star,
  ExternalLink,
  Share2
} from 'lucide-react';
import { formatFileSize } from '../utils/validation';
import type { Resource } from '../types';
import ModernCard from './ModernCard';
import DownloadButton from './DownloadButton';
import SocialShareButtons from './SocialShareButtons';

interface ResourceCardProps {
  resource: Resource;
  variant?: 'public' | 'admin';
  viewMode?: 'grid' | 'list' | 'compact';
  showActions?: boolean;
  showStats?: boolean;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: (selected: boolean) => void;
  isSelected?: boolean;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  variant = 'public',
  viewMode = 'grid',
  showActions = true,
  showStats = true,
  onView,
  onEdit,
  onDelete,
  onSelect,
  isSelected = false
}) => {
  const getCategoryIcon = (category: string) => {
    const icons = {
      guide: '📖',
      form: '📝',
      map: '🗺️',
      report: '📊',
      plan: '📋',
      manual: '📚'
    };
    return icons[category as keyof typeof icons] || '📄';
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
    const icons = {
      pdf: '📄',
      doc: '📝',
      docx: '📝',
      image: '🖼️',
      video: '🎥',
      zip: '📦'
    };
    return icons[fileType as keyof typeof icons] || '📄';
  };

  // Compact view for sidebars or small spaces
  if (viewMode === 'compact') {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{getCategoryIcon(resource.category)}</span>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 text-sm truncate">{resource.title}</h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="uppercase">{resource.file_type}</span>
              {resource.file_size && <span>• {formatFileSize(resource.file_size)}</span>}
              {showStats && <span>• {resource.download_count} downloads</span>}
            </div>
          </div>
        </div>
        <DownloadButton
          resourceId={resource.id}
          resourceTitle={resource.title}
          fileUrl={resource.file_url}
          size="sm"
          variant="ghost"
          showProgress={false}
        />
      </div>
    );
  }

  // List view for table-like display
  if (viewMode === 'list') {
    return (
      <ModernCard variant="interactive" className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {variant === 'admin' && onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">{getCategoryIcon(resource.category)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">{resource.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                {resource.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                    <Star size={10} className="mr-1" />
                    Featured
                  </span>
                )}
                {showStats && (
                  <span className="text-xs text-gray-500">
                    {resource.download_count} downloads
                  </span>
                )}
                {resource.file_size && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(resource.file_size)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {showActions && (
              <>
                {onView && (
                  <button
                    onClick={onView}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                )}
                
                {variant === 'admin' && onEdit && (
                  <button
                    onClick={onEdit}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                )}
                
                {variant === 'admin' && onDelete && (
                  <button
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </>
            )}
            
            <DownloadButton
              resourceId={resource.id}
              resourceTitle={resource.title}
              fileUrl={resource.file_url}
              size="sm"
              variant="primary"
            />
          </div>
        </div>
      </ModernCard>
    );
  }

  // Default grid view
  return (
    <ModernCard variant="interactive" hover glow className="overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {variant === 'admin' && onSelect && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelect(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            )}
            
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">{getCategoryIcon(resource.category)}</span>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">{resource.title}</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded ${getCategoryColor(resource.category)}`}>
                  {resource.category}
                </span>
                {resource.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center">
                    <Star size={10} className="mr-1" />
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {variant === 'admin' && showActions && (
            <div className="flex items-center space-x-2">
              {onView && (
                <button
                  onClick={onView}
                  className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
        
        {resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{resource.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <span className="text-lg mr-1">{getFileTypeIcon(resource.file_type)}</span>
              <span className="uppercase">{resource.file_type}</span>
            </div>
            {resource.file_size && (
              <span>{formatFileSize(resource.file_size)}</span>
            )}
            {showStats && (
              <div className="flex items-center">
                <Download size={14} className="mr-1" />
                <span>{resource.download_count}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(resource.file_url, '_blank')}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={14} />
            </button>
            
            <SocialShareButtons
              url={`${window.location.origin}/resources/${resource.id}`}
              title={resource.title}
              description={resource.description}
              variant="dropdown"
              size="sm"
              showLabels={false}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Added: {new Date(resource.created_at).toLocaleDateString()}
          </div>
          
          <DownloadButton
            resourceId={resource.id}
            resourceTitle={resource.title}
            fileUrl={resource.file_url}
            variant={variant === 'admin' ? 'secondary' : 'primary'}
            size={size}
          />
        </div>
      </div>
    </ModernCard>
  );
};

export default ResourceCard;