import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Eye, Globe, FileText, Layout, Settings, X, Save, Code,
  Search, Filter, Calendar, BarChart3, Users, Image, Video, MapPin, Phone, Mail,
  Facebook, Twitter, Instagram, Youtube, Linkedin, Check, AlertCircle, Info,
  HelpCircle, Star, Heart, Share2, Download, Upload, Copy, Move, RotateCcw,
  ZoomIn, ZoomOut, Maximize, Minimize, AlignLeft, AlignCenter, AlignRight,
  Bold, Italic, Underline, List, ListOrdered, Link, Table, Code as CodeIcon
} from 'lucide-react';

const PagesManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedPageForSections, setSelectedPageForSections] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTemplate, setFilterTemplate] = useState('all');
  const [sortBy, setSortBy] = useState('updated_at');
  const [viewMode, setViewMode] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
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

  const [pages, setPages] = useState([
    {
      id: '1',
      title: 'Home',
      slug: 'home',
      content: 'Welcome to our barangay website...',
      meta_description: 'Official website of Barangay MDRRMO',
      meta_keywords: 'barangay, mdrrmo, disaster, preparedness',
      hero_title: 'Welcome to Barangay MDRRMO',
      hero_subtitle: 'Your safety is our priority',
      hero_image: 'https://placehold.co/1200x600',
      status: 'published',
      template: 'default',
      featured: true,
      view_count: 1250,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-20T14:45:00Z'
    },
    {
      id: '2',
      title: 'About Us',
      slug: 'about',
      content: 'Learn about our barangay...',
      meta_description: 'About Barangay MDRRMO and our mission',
      meta_keywords: 'about, mission, vision, barangay',
      hero_title: 'About Our Barangay',
      hero_subtitle: 'Serving the community since 1995',
      hero_image: 'https://placehold.co/1200x600',
      status: 'published',
      template: 'about',
      featured: false,
      view_count: 890,
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-18T11:20:00Z'
    },
    {
      id: '3',
      title: 'Disaster Preparedness',
      slug: 'disaster-preparedness',
      content: 'Resources for disaster preparedness...',
      meta_description: 'Disaster preparedness resources and guides',
      meta_keywords: 'disaster, preparedness, emergency, safety',
      hero_title: 'Be Prepared, Stay Safe',
      hero_subtitle: 'Download essential preparedness materials',
      hero_image: 'https://placehold.co/1200x600',
      status: 'published',
      template: 'disaster-plan',
      featured: true,
      view_count: 2100,
      created_at: '2024-01-05T16:45:00Z',
      updated_at: '2024-01-22T09:30:00Z'
    },
    {
      id: '4',
      title: 'Services',
      slug: 'services',
      content: 'Our community services...',
      meta_description: 'List of barangay services and programs',
      meta_keywords: 'services, programs, community, barangay',
      hero_title: 'Community Services',
      hero_subtitle: 'Programs and services for residents',
      hero_image: 'https://placehold.co/1200x600',
      status: 'draft',
      template: 'services',
      featured: false,
      view_count: 450,
      created_at: '2024-01-12T13:20:00Z',
      updated_at: '2024-01-19T15:10:00Z'
    },
    {
      id: '5',
      title: 'News & Updates',
      slug: 'news',
      content: 'Latest news and updates...',
      meta_description: 'Latest news and updates from Barangay MDRRMO',
      meta_keywords: 'news, updates, announcements, barangay',
      hero_title: 'Latest News & Updates',
      hero_subtitle: 'Stay informed with our latest announcements',
      hero_image: 'https://placehold.co/1200x600',
      status: 'published',
      template: 'news',
      featured: false,
      view_count: 680,
      created_at: '2024-01-08T11:45:00Z',
      updated_at: '2024-01-21T16:30:00Z'
    },
    {
      id: '6',
      title: 'Resources & Downloads',
      slug: 'resources',
      content: 'Downloadable resources and materials...',
      meta_description: 'Downloadable resources and materials for community preparedness',
      meta_keywords: 'resources, downloads, materials, preparedness',
      hero_title: 'Resources & Downloads',
      hero_subtitle: 'Essential materials for community preparedness',
      hero_image: 'https://placehold.co/1200x600',
      status: 'published',
      template: 'resources',
      featured: true,
      view_count: 1520,
      created_at: '2024-01-03T09:30:00Z',
      updated_at: '2024-01-17T14:15:00Z'
    }
  ]);

  const templates = [
    { id: 'default', name: 'Default Page', description: 'Standard page layout' },
    { id: 'about', name: 'About Page', description: 'About MDRRMO template' },
    { id: 'services', name: 'Services Page', description: 'Services showcase template' },
    { id: 'news', name: 'News Portal', description: 'News listing and detail template' },
    { id: 'resources', name: 'Resources Page', description: 'Downloads and resources template' },
    { id: 'disaster-plan', name: 'Disaster Planning', description: 'DRRM planning template' }
  ];

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const filteredAndSortedPages = pages
    .filter(page => {
      const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          page.meta_description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
      const matchesTemplate = filterTemplate === 'all' || page.template === filterTemplate;
      return matchesSearch && matchesStatus && matchesTemplate;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created_at':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'view_count':
          return b.view_count - a.view_count;
        default:
          return new Date(b.updated_at) - new Date(a.updated_at);
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPages = filteredAndSortedPages.slice(startIndex, startIndex + itemsPerPage);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const pageData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title),
      id: editingPage || Date.now().toString(),
      created_at: editingPage ? pages.find(p => p.id === editingPage)?.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: editingPage ? pages.find(p => p.id === editingPage)?.view_count : 0
    };

    if (editingPage) {
      setPages(pages.map(page => page.id === editingPage ? pageData : page));
    } else {
      setPages([...pages, pageData]);
    }
    
    resetForm();
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

  const handleEdit = (page) => {
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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this page?')) {
      setPages(pages.filter(page => page.id !== id));
    }
  };

  const handleTitleChange = (title) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }));
  };

  const handleOpenEditor = (page) => {
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

  const handleEditorSave = (content, sections = []) => {
    const pageData = {
      ...formData,
      content,
      slug: formData.slug || generateSlug(formData.title),
      id: editingPage || Date.now().toString(),
      created_at: editingPage ? pages.find(p => p.id === editingPage)?.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: editingPage ? pages.find(p => p.id === editingPage)?.view_count : 0
    };

    if (editingPage) {
      setPages(pages.map(page => page.id === editingPage ? pageData : page));
      alert('Page updated successfully!');
    } else {
      setPages([...pages, pageData]);
      alert('Page created successfully!');
    }
    
    setIsEditorOpen(false);
    resetForm();
  };

  const PageEditor = ({ initialContent, onSave, onPreview }) => {
    const [content, setContent] = useState(initialContent);
    const [activeTab, setActiveTab] = useState('visual');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const editorTools = [
      { icon: Bold, action: 'bold', title: 'Bold' },
      { icon: Italic, action: 'italic', title: 'Italic' },
      { icon: Underline, action: 'underline', title: 'Underline' },
      { icon: AlignLeft, action: 'align-left', title: 'Align Left' },
      { icon: AlignCenter, action: 'align-center', title: 'Align Center' },
      { icon: AlignRight, action: 'align-right', title: 'Align Right' },
      { icon: List, action: 'list', title: 'Bullet List' },
      { icon: ListOrdered, action: 'list-ordered', title: 'Numbered List' },
      { icon: Link, action: 'link', title: 'Insert Link' },
      { icon: Image, action: 'image', title: 'Insert Image' },
      { icon: Video, action: 'video', title: 'Insert Video' },
      { icon: Table, action: 'table', title: 'Insert Table' }
    ];

    const insertContent = (type) => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedText = range.toString();
        let newText = '';

        switch (type) {
          case 'bold':
            newText = `**${selectedText || 'bold text'}**`;
            break;
          case 'italic':
            newText = `*${selectedText || 'italic text'}*`;
            break;
          case 'underline':
            newText = `__${selectedText || 'underlined text'}__`;
            break;
          case 'link':
            newText = `[${selectedText || 'link text'}](https://example.com)`;
            break;
          case 'image':
            newText = `![alt text](https://placehold.co/600x400)`;
            break;
          default:
            newText = selectedText || `${type} content`;
        }

        const newContent = content.substring(0, range.startOffset) + newText + content.substring(range.endOffset);
        setContent(newContent);
      }
    };

    return (
      <div className="h-full flex flex-col bg-gray-50">
        {/* Editor Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex space-x-1">
              {editorTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <button
                    key={tool.action}
                    onClick={() => insertContent(tool.action)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title={tool.title}
                  >
                    <IconComponent size={18} />
                  </button>
                );
              })}
            </div>
            <div className="h-6 w-px bg-gray-300"></div>
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Eye size={18} />
              <span>Preview</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onPreview}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              View Live
            </button>
            <button
              onClick={() => onSave(content)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Page</span>
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-6 border-0 rounded-lg focus:ring-0 resize-none font-mono text-sm"
                placeholder="Start writing your page content here..."
              />
            </div>
          </div>
          
          {isPreviewOpen && (
            <div className="w-1/2 bg-white border-l border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 h-full overflow-y-auto">
                <div className="prose max-w-none">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Page Title'}</h1>
                  {content ? (
                    <div className="whitespace-pre-wrap text-gray-700">{content}</div>
                  ) : (
                    <p className="text-gray-500 italic">Content will appear here as you type...</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PageSectionManager = ({ pageId, onClose }) => {
    const [sections, setSections] = useState([
      {
        id: '1',
        type: 'hero',
        title: 'Hero Section',
        content: 'Welcome to our barangay',
        enabled: true
      },
      {
        id: '2',
        type: 'content',
        title: 'Main Content',
        content: 'Detailed information about our services',
        enabled: true
      },
      {
        id: '3',
        type: 'call-to-action',
        title: 'Call to Action',
        content: 'Get in touch with us today',
        enabled: true
      }
    ]);

    const sectionTypes = [
      { id: 'hero', name: 'Hero Section', icon: Image },
      { id: 'content', name: 'Content Block', icon: FileText },
      { id: 'call-to-action', name: 'Call to Action', icon: AlertCircle },
      { id: 'stats', name: 'Statistics', icon: BarChart3 },
      { id: 'team', name: 'Team Members', icon: Users },
      { id: 'contact', name: 'Contact Info', icon: Phone }
    ];

    const addSection = (type) => {
      const newSection = {
        id: Date.now().toString(),
        type,
        title: `${sectionTypes.find(t => t.id === type)?.name} ${sections.length + 1}`,
        content: '',
        enabled: true
      };
      setSections([...sections, newSection]);
    };

    const updateSection = (id, updates) => {
      setSections(sections.map(section => 
        section.id === id ? { ...section, ...updates } : section
      ));
    };

    const deleteSection = (id) => {
      setSections(sections.filter(section => section.id !== id));
    };

    const moveSection = (id, direction) => {
      const index = sections.findIndex(s => s.id === id);
      if (index === -1) return;

      const newSections = [...sections];
      if (direction === 'up' && index > 0) {
        [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
      } else if (direction === 'down' && index < newSections.length - 1) {
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
      }
      setSections(newSections);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Manage Page Sections</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <div className="flex h-full">
              {/* Sections List */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Add Section</h3>
                  <div className="space-y-2">
                    {sectionTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => addSection(type.id)}
                          className="w-full flex items-center space-x-2 p-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <IconComponent size={16} />
                          <span>{type.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Page Sections</h3>
                  <div className="space-y-2">
                    {sections.map((section, index) => {
                      const sectionType = sectionTypes.find(t => t.id === section.type);
                      const IconComponent = sectionType?.icon || FileText;
                      return (
                        <div key={section.id} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <IconComponent size={16} className="text-gray-500" />
                              <span className="font-medium text-sm">{section.title}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => moveSection(section.id, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <Move size={14} />
                              </button>
                              <button
                                onClick={() => moveSection(section.id, 'down')}
                                disabled={index === sections.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                              >
                                <Move size={14} className="transform rotate-180" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={section.enabled}
                                onChange={(e) => updateSection(section.id, { enabled: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="ml-2 text-xs text-gray-600">Enabled</span>
                            </label>
                            <button
                              onClick={() => deleteSection(section.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              
              {/* Section Editor */}
              <div className="flex-1 flex flex-col">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Section Editor</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  {sections.length > 0 ? (
                    <div className="space-y-6">
                      {sections.map((section) => (
                        <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">{section.title}</h4>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {sectionTypes.find(t => t.id === section.type)?.name}
                            </span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={section.title}
                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Content
                              </label>
                              <textarea
                                value={section.content}
                                onChange={(e) => updateSection(section.id, { content: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Layout size={48} className="mx-auto text-gray-300 mb-4" />
                      <p className="text-gray-500">No sections added yet</p>
                      <p className="text-sm text-gray-400 mt-1">Add sections from the left panel</p>
                    </div>
                  )}
                </div>
                <div className="p-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={onClose}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        alert('Sections updated successfully!');
                        onClose();
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pages Management</h1>
            <p className="text-gray-600">Create and manage website pages</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'table' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Grid
              </button>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Page</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{pages.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Check className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{pages.filter(p => p.status === 'published').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Edit className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{pages.filter(p => p.status === 'draft').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">{pages.filter(p => p.featured).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search pages by title, slug, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Templates</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>{template.name}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="updated_at">Last Updated</option>
                <option value="title">Title</option>
                <option value="created_at">Date Created</option>
                <option value="view_count">Views</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pages List */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{page.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{page.meta_description}</p>
                          {page.featured && (
                            <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Layout size={14} className="mr-1" />
                          {templates.find(t => t.id === page.template)?.name || 'Default'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <Globe size={14} className="mr-1" />
                          /{page.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {page.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.view_count || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(page.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/${page.slug}`, '_blank')}
                            className="text-green-600 hover:text-green-800 p-1"
                            title="View Page"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => setSelectedPageForSections(page.id)}
                            className="text-purple-600 hover:text-purple-800 p-1"
                            title="Manage Sections"
                          >
                            <Layout size={16} />
                          </button>
                          <button
                            onClick={() => handleOpenEditor(page)}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Open Editor"
                          >
                            <Code size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(page)}
                            className="text-gray-600 hover:text-gray-800 p-1"
                            title="Edit Page"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                            title="Delete Page"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAndSortedPages.length)} of {filteredAndSortedPages.length} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3 py-1 rounded text-sm ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedPages.map((page) => (
                <div key={page.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    {page.hero_image ? (
                      <img src={page.hero_image} alt={page.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText size={32} className="text-white opacity-50" />
                      </div>
                    )}
                    {page.featured && (
                      <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        page.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{page.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{page.meta_description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span className="flex items-center">
                        <Layout size={12} className="mr-1" />
                        {templates.find(t => t.id === page.template)?.name || 'Default'}
                      </span>
                      <span>{page.view_count || 0} views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Updated {new Date(page.updated_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`/${page.slug}`, '_blank')}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="View Page"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setSelectedPageForSections(page.id)}
                          className="text-purple-600 hover:text-purple-800 p-1"
                          title="Manage Sections"
                        >
                          <Layout size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(page)}
                          className="text-gray-600 hover:text-gray-800 p-1"
                          title="Edit Page"
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination for Grid View */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPage ? 'Edit Page' : 'Create New Page'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Page Title
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
                      URL Slug
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
                    Template
                  </label>
                  <select
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name} - {template.description}
                      </option>
                    ))}
                  </select>
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
                    Page Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your page content here..."
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
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingPage ? 'Update Page' : 'Create Page'}</span>
                  </button>
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
    </div>
  );
};

export default PagesManagement;