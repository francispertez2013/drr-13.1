import React, { useState, useEffect } from 'react';
import { 
  Download, 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Plus, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Loader,
  Star,
  Calendar,
  Tag,
  BarChart3,
  TrendingUp,
  Users,
  Globe
} from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import { useAnalytics } from '../utils/analytics';
import { validateFileUpload } from '../utils/security';
import { formatFileSize } from '../utils/validation';
import type { Resource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import ModernButton from './ModernButton';
import ModernCard from './ModernCard';

interface ResourceManagerProps {
  variant?: 'public' | 'admin';
  showStats?: boolean;
  maxItems?: number;
  categories?: string[];
  onResourceSelect?: (resource: Resource) => void;
}

interface DownloadState {
  [key: string]: 'idle' | 'downloading' | 'success' | 'error';
}

const ResourceManager: React.FC<ResourceManagerProps> = ({
  variant = 'public',
  showStats = true,
  maxItems,
  categories,
  onResourceSelect
}) => {
  const { resources, incrementDownload, addResource, updateResource, deleteResource } = usePages();
  const { trackDownload } = useAnalytics();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'downloads' | 'date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [downloadStates, setDownloadStates] = useState<DownloadState>({});
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingResource, setViewingResource] = useState<Resource | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file_url: '',
    file_type: 'pdf' as Resource['file_type'],
    file_size: 0,
    category: 'guide' as Resource['category'],
    subcategory: '',
    tags: [] as string[],
    featured: false,
    status: 'draft' as Resource['status']
  });
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Filter resources based on variant and filters
  const filteredResources = resources.filter(resource => {
    // Public variant only shows published resources
    if (variant === 'public' && resource.status !== 'published') return false;
    
    // Category filter
    if (categories && !categories.includes(resource.category)) return false;
    
    // Search filter
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    
    // Status filter (admin only)
    const matchesStatus = variant === 'public' || statusFilter === 'all' || resource.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'downloads':
        comparison = a.download_count - b.download_count;
        break;
      case 'date':
        comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Limit items if specified
  const displayResources = maxItems ? sortedResources.slice(0, maxItems) : sortedResources;

  // Enhanced download handler with error handling and analytics
  const handleDownload = async (resource: Resource) => {
    try {
      setDownloadStates(prev => ({ ...prev, [resource.id]: 'downloading' }));
      
      // Track download attempt
      trackDownload(resource.id, resource.title);
      
      // Increment download count in database
      await incrementDownload(resource.id);
      
      // Check if URL is accessible
      const response = await fetch(resource.file_url, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error('File not accessible');
      }
      
      // Create download link
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.download = `${resource.title.replace(/[^a-z0-9]/gi, '_')}.${resource.file_type}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setDownloadStates(prev => ({ ...prev, [resource.id]: 'success' }));
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [resource.id]: 'idle' }));
      }, 3000);
      
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStates(prev => ({ ...prev, [resource.id]: 'error' }));
      
      // Show fallback options
      const shouldRetry = window.confirm(
        'Download failed. Would you like to try opening the file in a new tab?'
      );
      
      if (shouldRetry) {
        window.open(resource.file_url, '_blank');
      }
      
      // Reset state after 5 seconds
      setTimeout(() => {
        setDownloadStates(prev => ({ ...prev, [resource.id]: 'idle' }));
      }, 5000);
    }
  };

  // Form handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsUploading(true);
      
      if (editingResource) {
        await updateResource(editingResource, formData);
        alert('Resource updated successfully!');
      } else {
        await addResource(formData);
        alert('Resource created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving resource:', error);
      alert('Error saving resource. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      file_url: '',
      file_type: 'pdf',
      file_size: 0,
      category: 'guide',
      subcategory: '',
      tags: [],
      featured: false,
      status: 'draft'
    });
    setTagInput('');
    setEditingResource(null);
    setIsModalOpen(false);
    setUploadProgress(0);
  };

  const handleEdit = (resource: Resource) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      file_url: resource.file_url,
      file_type: resource.file_type,
      file_size: resource.file_size || 0,
      category: resource.category,
      subcategory: resource.subcategory || '',
      tags: resource.tags,
      featured: resource.featured || false,
      status: resource.status
    });
    setEditingResource(resource.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      try {
        await deleteResource(id);
        alert('Resource deleted successfully!');
      } catch (error) {
        console.error('Error deleting resource:', error);
        alert('Error deleting resource. Please try again.');
      }
    }
  };

  const handleView = (resource: Resource) => {
    setViewingResource(resource);
    setIsViewModalOpen(true);
    onResourceSelect?.(resource);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getDownloadButtonContent = (resource: Resource) => {
    const state = downloadStates[resource.id] || 'idle';
    
    switch (state) {
      case 'downloading':
        return (
          <>
            <Loader className="animate-spin" size={16} />
            <span>Downloading...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle size={16} />
            <span>Downloaded!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle size={16} />
            <span>Failed</span>
          </>
        );
      default:
        return (
          <>
            <Download size={16} />
            <span>Download</span>
          </>
        );
    }
  };

  const getDownloadButtonClass = (resource: Resource) => {
    const state = downloadStates[resource.id] || 'idle';
    const baseClass = "inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300";
    
    switch (state) {
      case 'downloading':
        return `${baseClass} bg-blue-100 text-blue-800 cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'error':
        return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200`;
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 hover:scale-105`;
    }
  };

  const resourceCategories = ['guide', 'form', 'map', 'report', 'plan', 'manual'];
  const fileTypes = ['pdf', 'doc', 'docx', 'image', 'video', 'zip'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {variant === 'admin' ? 'Resource Management' : 'Resources & Downloads'}
          </h2>
          <p className="text-gray-600">
            {variant === 'admin' 
              ? 'Manage downloadable resources and documents'
              : 'Access essential documents and resources'
            }
          </p>
        </div>
        
        {variant === 'admin' && (
          <ModernButton
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
            variant="primary"
            size="md"
          >
            Add Resource
          </ModernButton>
        )}
      </div>

      {/* Stats Cards (Admin only) */}
      {variant === 'admin' && showStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900">{resources.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </ModernCard>
          
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-3xl font-bold text-green-600">
                  {resources.filter(r => r.status === 'published').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </ModernCard>
          
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                <p className="text-3xl font-bold text-purple-600">
                  {resources.reduce((sum, r) => sum + r.download_count, 0)}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </ModernCard>
          
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {resources.filter(r => r.featured).length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </ModernCard>
        </div>
      )}

      {/* Filters and Search */}
      <ModernCard variant="glass" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            {resourceCategories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>

          {variant === 'admin' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          )}

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="downloads">Sort by Downloads</option>
            <option value="date">Sort by Date</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <TrendingUp 
              size={16} 
              className={`transform transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
            />
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <BarChart3 size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FileText size={16} />
            </button>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {displayResources.length} of {filteredResources.length} resources
          </span>
          {variant === 'admin' && selectedResources.size > 0 && (
            <span>
              {selectedResources.size} selected
            </span>
          )}
        </div>
      </ModernCard>

      {/* Resources Display */}
      {displayResources.length === 0 ? (
        <ModernCard className="p-12 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Resources Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'No resources have been uploaded yet'
            }
          </p>
          {variant === 'admin' && (
            <ModernButton
              onClick={() => setIsModalOpen(true)}
              icon={Plus}
              variant="primary"
            >
              Add First Resource
            </ModernButton>
          )}
        </ModernCard>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
        }>
          {displayResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              variant={variant}
              viewMode={viewMode}
              downloadState={downloadStates[resource.id] || 'idle'}
              onDownload={() => handleDownload(resource)}
              onView={() => handleView(resource)}
              onEdit={variant === 'admin' ? () => handleEdit(resource) : undefined}
              onDelete={variant === 'admin' ? () => handleDelete(resource.id) : undefined}
              isSelected={selectedResources.has(resource.id)}
              onSelect={variant === 'admin' ? (selected) => {
                setSelectedResources(prev => {
                  const newSet = new Set(prev);
                  if (selected) {
                    newSet.add(resource.id);
                  } else {
                    newSet.delete(resource.id);
                  }
                  return newSet;
                });
              } : undefined}
            />
          ))}
        </div>
      )}

      {/* Resource Form Modal */}
      {isModalOpen && variant === 'admin' && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingResource ? 'Edit Resource' : 'Add Resource'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File URL *
                </label>
                <input
                  type="url"
                  value={formData.file_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/document.pdf"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    File Type
                  </label>
                  <select
                    value={formData.file_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {fileTypes.map((type) => (
                      <option key={type} value={type}>{type.toUpperCase()}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {resourceCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory
                </label>
                <input
                  type="text"
                  value={formData.subcategory}
                  onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Emergency Procedures, Training Materials"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File Size (bytes)
                </label>
                <input
                  type="number"
                  value={formData.file_size}
                  onChange={(e) => setFormData(prev => ({ ...prev, file_size: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a tag"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Featured Resource</span>
                  </label>
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900">Saving...</span>
                    <span className="text-sm text-blue-700">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <ModernButton
                  type="button"
                  onClick={resetForm}
                  variant="secondary"
                  disabled={isUploading}
                >
                  Cancel
                </ModernButton>
                <ModernButton
                  type="submit"
                  variant="primary"
                  icon={Upload}
                  disabled={isUploading}
                  loading={isUploading}
                >
                  {editingResource ? 'Update Resource' : 'Create Resource'}
                </ModernButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resource View Modal */}
      {isViewModalOpen && viewingResource && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Resource Details</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{viewingResource.title}</h3>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {viewingResource.category}
                  </span>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                    {viewingResource.file_type.toUpperCase()}
                  </span>
                  {viewingResource.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-700">{viewingResource.description}</p>
              </div>

              {viewingResource.subcategory && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Subcategory</h4>
                  <p className="text-gray-700">{viewingResource.subcategory}</p>
                </div>
              )}

              {viewingResource.tags.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {viewingResource.tags.map((tag, index) => (
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Downloads</h4>
                  <p className="text-2xl font-bold text-blue-600">{viewingResource.download_count}</p>
                </div>
                {viewingResource.file_size && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">File Size</h4>
                    <p className="text-2xl font-bold text-green-600">
                      {formatFileSize(viewingResource.file_size)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDownload(viewingResource)}
                  className={getDownloadButtonClass(viewingResource)}
                  disabled={downloadStates[viewingResource.id] === 'downloading'}
                >
                  {getDownloadButtonContent(viewingResource)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Resource Card Component
interface ResourceCardProps {
  resource: Resource;
  variant: 'public' | 'admin';
  viewMode: 'grid' | 'list';
  downloadState: 'idle' | 'downloading' | 'success' | 'error';
  onDownload: () => void;
  onView: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  variant,
  viewMode,
  downloadState,
  onDownload,
  onView,
  onEdit,
  onDelete,
  isSelected,
  onSelect
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'guide': return '📖';
      case 'form': return '📝';
      case 'map': return '🗺️';
      case 'report': return '📊';
      case 'plan': return '📋';
      default: return '📄';
    }
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

  const getDownloadButtonContent = () => {
    switch (downloadState) {
      case 'downloading':
        return (
          <>
            <Loader className="animate-spin" size={16} />
            <span>Downloading...</span>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle size={16} />
            <span>Downloaded!</span>
          </>
        );
      case 'error':
        return (
          <>
            <AlertTriangle size={16} />
            <span>Retry</span>
          </>
        );
      default:
        return (
          <>
            <Download size={16} />
            <span>Download</span>
          </>
        );
    }
  };

  const getDownloadButtonClass = () => {
    const baseClass = "inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300";
    
    switch (downloadState) {
      case 'downloading':
        return `${baseClass} bg-blue-100 text-blue-800 cursor-not-allowed`;
      case 'success':
        return `${baseClass} bg-green-100 text-green-800`;
      case 'error':
        return `${baseClass} bg-red-100 text-red-800 hover:bg-red-200`;
      default:
        return `${baseClass} bg-blue-600 text-white hover:bg-blue-700 hover:scale-105`;
    }
  };

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
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{resource.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-1">{resource.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {resource.category}
                </span>
                <span className="text-xs text-gray-500">
                  {resource.download_count} downloads
                </span>
                {resource.file_size && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(resource.file_size)}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onView}
              className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="View Details"
            >
              <Eye size={16} />
            </button>
            
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
            
            <button
              onClick={onDownload}
              className={getDownloadButtonClass()}
              disabled={downloadState === 'downloading'}
            >
              {getDownloadButtonContent()}
            </button>
          </div>
        </div>
      </ModernCard>
    );
  }

  // Grid view
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
              <h3 className="font-semibold text-gray-900 line-clamp-2">{resource.title}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {resource.category}
                </span>
                {resource.featured && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {variant === 'admin' && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onView}
                className="text-gray-600 hover:text-gray-800"
                title="View Details"
              >
                <Eye size={16} />
              </button>
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  className="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{resource.description}</p>
        
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
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Download size={14} className="mr-1" />
              <span>{resource.download_count}</span>
            </div>
            <span className="uppercase">{resource.file_type}</span>
            {resource.file_size && (
              <span>{formatFileSize(resource.file_size)}</span>
            )}
          </div>
          
          <button
            onClick={onDownload}
            className={getDownloadButtonClass()}
            disabled={downloadState === 'downloading'}
          >
            {getDownloadButtonContent()}
          </button>
        </div>
      </div>
    </ModernCard>
  );
};

export default ResourceManager;