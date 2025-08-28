import React, { useState } from 'react';
import { 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff,
  Archive,
  Upload,
  CheckCircle,
  AlertTriangle,
  Loader
} from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import { downloadManager } from '../utils/downloadManager';
import { useDownload } from '../hooks/useDownload';
import ModernButton from './ModernButton';
import type { Resource } from '../types';

interface ResourceBulkActionsProps {
  selectedResources: Resource[];
  onSelectionChange: (resources: Resource[]) => void;
  onActionComplete: () => void;
}

const ResourceBulkActions: React.FC<ResourceBulkActionsProps> = ({
  selectedResources,
  onSelectionChange,
  onActionComplete
}) => {
  const { updateResource, deleteResource } = usePages();
  const { downloadMultiple, isDownloading, progress } = useDownload();
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionType, setActionType] = useState<string | null>(null);

  const handleBulkDownload = async () => {
    if (selectedResources.length === 0) return;
    
    try {
      setActionType('download');
      
      const downloads = selectedResources.map(resource => ({
        url: resource.file_url,
        resourceId: resource.id,
        resourceTitle: resource.title,
        options: {
          filename: `${resource.title.replace(/[^a-z0-9]/gi, '_')}.${resource.file_type}`
        }
      }));

      const results = await downloadMultiple(downloads);
      const successCount = results.filter(r => r.success).length;
      
      alert(`Successfully downloaded ${successCount} of ${selectedResources.length} files`);
      onActionComplete();
    } catch (error) {
      console.error('Bulk download failed:', error);
      alert('Bulk download failed. Please try again.');
    } finally {
      setActionType(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedResources.length === 0) return;
    
    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedResources.length} resource(s)? This action cannot be undone.`
    );
    
    if (!confirmed) return;
    
    try {
      setIsProcessing(true);
      setActionType('delete');
      
      const deletePromises = selectedResources.map(resource => 
        deleteResource(resource.id)
      );
      
      await Promise.all(deletePromises);
      
      alert(`Successfully deleted ${selectedResources.length} resource(s)`);
      onSelectionChange([]);
      onActionComplete();
    } catch (error) {
      console.error('Bulk delete failed:', error);
      alert('Some resources could not be deleted. Please try again.');
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleBulkStatusChange = async (status: 'published' | 'draft') => {
    if (selectedResources.length === 0) return;
    
    try {
      setIsProcessing(true);
      setActionType('status');
      
      const updatePromises = selectedResources.map(resource => 
        updateResource(resource.id, { status })
      );
      
      await Promise.all(updatePromises);
      
      alert(`Successfully updated ${selectedResources.length} resource(s) to ${status}`);
      onActionComplete();
    } catch (error) {
      console.error('Bulk status update failed:', error);
      alert('Some resources could not be updated. Please try again.');
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleBulkFeatureToggle = async (featured: boolean) => {
    if (selectedResources.length === 0) return;
    
    try {
      setIsProcessing(true);
      setActionType('feature');
      
      const updatePromises = selectedResources.map(resource => 
        updateResource(resource.id, { featured })
      );
      
      await Promise.all(updatePromises);
      
      alert(`Successfully ${featured ? 'featured' : 'unfeatured'} ${selectedResources.length} resource(s)`);
      onActionComplete();
    } catch (error) {
      console.error('Bulk feature update failed:', error);
      alert('Some resources could not be updated. Please try again.');
    } finally {
      setIsProcessing(false);
      setActionType(null);
    }
  };

  const handleSelectAll = () => {
    // This would be implemented by the parent component
    // For now, we'll just clear selection
    onSelectionChange([]);
  };

  const getActionButton = (action: string, icon: React.ReactNode, label: string, onClick: () => void, variant: any = 'secondary') => {
    const isCurrentAction = actionType === action;
    const disabled = isProcessing || isDownloading;
    
    return (
      <ModernButton
        onClick={onClick}
        disabled={disabled}
        loading={isCurrentAction && (isProcessing || isDownloading)}
        icon={isCurrentAction && (isProcessing || isDownloading) ? Loader : icon}
        variant={variant}
        size="sm"
      >
        {isCurrentAction && (isProcessing || isDownloading) ? 'Processing...' : label}
      </ModernButton>
    );
  };

  if (selectedResources.length === 0) {
    return null;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="text-blue-600" size={20} />
          <span className="font-medium text-blue-900">
            {selectedResources.length} resource{selectedResources.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          {getActionButton(
            'download',
            <Download size={16} />,
            'Download All',
            handleBulkDownload,
            'primary'
          )}
          
          {getActionButton(
            'status',
            <Eye size={16} />,
            'Publish',
            () => handleBulkStatusChange('published')
          )}
          
          {getActionButton(
            'status',
            <EyeOff size={16} />,
            'Unpublish',
            () => handleBulkStatusChange('draft')
          )}
          
          {getActionButton(
            'feature',
            <Star size={16} />,
            'Feature',
            () => handleBulkFeatureToggle(true)
          )}
          
          {getActionButton(
            'feature',
            <StarOff size={16} />,
            'Unfeature',
            () => handleBulkFeatureToggle(false)
          )}
          
          {getActionButton(
            'delete',
            <Trash2 size={16} />,
            'Delete',
            handleBulkDelete,
            'danger'
          )}
          
          <ModernButton
            onClick={handleSelectAll}
            variant="ghost"
            size="sm"
          >
            Clear Selection
          </ModernButton>
        </div>
      </div>
      
      {/* Progress indicator for bulk operations */}
      {(isProcessing || isDownloading) && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-700">
              {actionType === 'download' ? 'Downloading files...' : 'Processing...'}
            </span>
            <span className="text-sm text-blue-700">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceBulkActions;