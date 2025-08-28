import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Globe, 
  FileText, 
  Layout, 
  Settings, 
  X, 
  Save, 
  Code,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  Copy,
  Star,
  Calendar,
  BarChart3,
  Users,
  TrendingUp
} from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import PageEditor from './PageEditor';
import PageSectionManager from './PageSectionManager';
import ModernCard from './ModernCard';
import ModernButton from './ModernButton';
import type { Page, PageSection } from '../types';

interface PageManagerProps {
  variant?: 'admin' | 'embedded';
  showStats?: boolean;
  onPageSelect?: (page: Page) => void;
}

const EnhancedPageManager: React.FC<PageManagerProps> = ({
  variant = 'admin',
  showStats = true,
  onPageSelect
}) => {
  const { pages, addPage, updatePage, deletePage, incrementPageView } = usePages();

  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPageForSections, setSelectedPageForSections] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'title' | 'views' | 'date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    meta_description: '',
    meta_keywords: '',
    hero_title: '',
    hero_subtitle: '',
    hero_image: '',
    status: 'draft' as 'published' | 'draft',
    template: 'default' as 'default' | 'about' | 'services' | 'news' | 'resources' | 'disaster-plan',
    featured: false
  });

  const templates = [
    { id: 'default', name: 'Default Page', description: 'Standard page layout', icon: FileText },
    { id: 'about', name: 'About Page', description: 'About MDRRMO template', icon: Users },
    { id: 'services', name: 'Services Page', description: 'Services showcase template', icon: Settings },
    { id: 'news', name: 'News Portal', description: 'News listing and detail template', icon: FileText },
    { id: 'resources', name: 'Resources Page', description: 'Downloads and resources template', icon: FileText },
    { id: 'disaster-plan', name: 'Disaster Planning', description: 'DRRM planning template', icon: Layout }
  ];

  // Filter and sort pages
  const filteredPages = pages.filter(page => {
    const matchesSearch = 
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (page.meta_description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || page.template === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const sortedPages = [...filteredPages].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'views':
        comparison = (a.view_count || 0) - (b.view_count || 0);
        break;
      case 'date':
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const pageData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title)
      };

      if (editingPage) {
        await updatePage(editingPage, pageData);
        alert('Page updated successfully!');
      } else {
        await addPage(pageData);
        alert('Page created successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      meta_description: '',
      meta_keywords: '',
      hero_title: '',
      hero_subtitle: '',
      hero_image: '',
      status: 'draft',
      template: 'default',
      featured: false
    });
    setEditingPage(null);
    setIsModalOpen(false);
  };

  const handleEdit = (page: Page) => {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      meta_description: page.meta_description || '',
      meta_keywords: page.meta_keywords || '',
      hero_title: page.hero_title || '',
      hero_subtitle: page.hero_subtitle || '',
      hero_image: page.hero_image || '',
      status: page.status,
      template: page.template,
      featured: page.featured || false
    });
    setEditingPage(page.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(id);
        alert('Page deleted successfully!');
      } catch (error) {
        console.error('Error deleting page:', error);
        alert('Error deleting page. Please try again.');
      }
    }
  };

  const handleDuplicate = async (page: Page) => {
    try {
      const duplicatedPage = {
        title: `${page.title} (Copy)`,
        slug: `${page.slug}-copy`,
        content: page.content,
        meta_description: page.meta_description,
        meta_keywords: page.meta_keywords,
        hero_title: page.hero_title,
        hero_subtitle: page.hero_subtitle,
        hero_image: page.hero_image,
        status: 'draft' as const,
        template: page.template,
        featured: false
      };
      
      await addPage(duplicatedPage);
      alert('Page duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating page:', error);
      alert('Error duplicating page. Please try again.');
    }
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleOpenEditor = (page?: Page) => {
    if (page) {
      setFormData({
        title: page.title,
        slug: page.slug,
        content: page.content,
        meta_description: page.meta_description || '',
        meta_keywords: page.meta_keywords || '',
        hero_title: page.hero_title || '',
        hero_subtitle: page.hero_subtitle || '',
        hero_image: page.hero_image || '',
        status: page.status,
        template: page.template,
        featured: page.featured || false
      });
      setEditingPage(page.id);
    }
    setIsEditorOpen(true);
  };

  const handleEditorSave = async (content: string, sections: any[]) => {
    try {
      const pageData = {
        ...formData,
        content,
        slug: formData.slug || generateSlug(formData.title)
      };

      if (editingPage) {
        await updatePage(editingPage, pageData);
        alert('Page updated successfully!');
      } else {
        await addPage(pageData);
        alert('Page created successfully!');
      }
      
      setIsEditorOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page. Please try again.');
    }
  };

  const getTemplateIcon = (template: string) => {
    const templateConfig = templates.find(t => t.id === template);
    return templateConfig?.icon || FileText;
  };

  const pageStats = {
    total: pages.length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    featured: pages.filter(p => p.featured).length,
    totalViews: pages.reduce((sum, p) => sum + (p.view_count || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {variant === 'admin' ? 'Pages Management' : 'Page Manager'}
          </h1>
          <p className="text-gray-600">Create and manage dynamic website pages</p>
        </div>
        <div className="flex space-x-3">
          <ModernButton
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
            variant="primary"
          >
            Add Page
          </ModernButton>
          <ModernButton
            onClick={() => setIsEditorOpen(true)}
            icon={Code}
            variant="secondary"
          >
            Page Editor
          </ModernButton>
        </div>
      </div>

      {/* Stats Cards */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">{pageStats.total}</p>
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
                <p className="text-3xl font-bold text-green-600">{pageStats.published}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-3xl font-bold text-yellow-600">{pageStats.draft}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Edit className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-3xl font-bold text-purple-600">{pageStats.featured}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </ModernCard>

          <ModernCard variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-indigo-600">{pageStats.totalViews}</p>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </ModernCard>
        </div>
      )}

      {/* Filters */}
      <ModernCard variant="glass" className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Templates</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>{template.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="title">Sort by Title</option>
            <option value="views">Sort by Views</option>
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
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          Showing {sortedPages.length} of {pages.length} pages
        </div>
      </ModernCard>

      {/* Pages Grid */}
      {sortedPages.length === 0 ? (
        <ModernCard className="p-12 text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Pages Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || statusFilter !== 'all' || templateFilter !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Create your first page to get started'
            }
          </p>
          <ModernButton
            onClick={() => setIsModalOpen(true)}
            icon={Plus}
            variant="primary"
          >
            Create First Page
          </ModernButton>
        </ModernCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPages.map((page) => {
            const TemplateIcon = getTemplateIcon(page.template);
            
            return (
              <ModernCard key={page.id} variant="interactive" hover className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TemplateIcon className="text-blue-600" size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">{page.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {templates.find(t => t.id === page.template)?.name || 'Default'}
                          </span>
                          {page.featured && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                        className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-100 transition-colors"
                        title="View Page"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => setSelectedPageForSections(page.id)}
                        className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-100 transition-colors"
                        title="Manage Sections"
                      >
                        <Layout size={16} />
                      </button>
                      <button
                        onClick={() => handleOpenEditor(page)}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="Open Editor"
                      >
                        <Code size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(page)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                        title="Edit Page"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(page)}
                        className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Duplicate Page"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(page.id)}
                        className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-100 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {page.meta_description || 'No description available'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Globe size={14} className="mr-1" />
                        <span>/{page.slug}</span>
                      </div>
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        <span>{page.view_count || 0} views</span>
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      page.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {page.status}
                    </span>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Updated: {new Date(page.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </ModernCard>
            );
          })}
        </div>
      )}

      {/* Page Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPage ? 'Edit Page' : 'Create New Page'}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      /
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template
                </label>
                <select
                  value={formData.template}
                  onChange={(e) => setFormData({ ...formData, template: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Title
                  </label>
                  <input
                    type="text"
                    value={formData.hero_title}
                    onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional hero section title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hero Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.hero_subtitle}
                    onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Optional hero section subtitle"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  value={formData.hero_image}
                  onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Optional hero background image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description for search engines (150-160 characters)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Comma-separated keywords for SEO"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your page content here... (HTML supported)"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
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
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Featured Page</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <ModernButton
                  type="button"
                  onClick={resetForm}
                  variant="secondary"
                >
                  Cancel
                </ModernButton>
                <ModernButton
                  type="submit"
                  variant="primary"
                  icon={Save}
                >
                  {editingPage ? 'Update Page' : 'Create Page'}
                </ModernButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPage ? 'Edit Page' : 'Create New Page'}
                </h2>
                <p className="text-sm text-gray-600">{formData.title || 'Untitled Page'}</p>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Page title..."
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={() => setIsEditorOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="flex-1">
              <PageEditor
                initialContent={formData.content}
                onSave={handleEditorSave}
                onPreview={() => window.open(`/${formData.slug}`, '_blank')}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sections Management Modal */}
      {selectedPageForSections && (
        <PageSectionManager
          pageId={selectedPageForSections}
          onClose={() => setSelectedPageForSections(null)}
        />
      )}
    </div>
  );
};

export default EnhancedPageManager;