import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Eye, EyeOff, Copy, Layout } from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import type { PageSection } from '../types';

interface PageSectionManagerProps {
  pageId: string;
  onClose: () => void;
}

const PageSectionManager: React.FC<PageSectionManagerProps> = ({ pageId, onClose }) => {
  const { getSectionsByPageId, addSection, updateSection, deleteSection } = usePages();
  const [sections, setSections] = useState<PageSection[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'content' as PageSection['type'],
    title: '',
    content: '',
    data: {},
    order_index: 1,
    is_active: true
  });

  const sectionTypes = [
    { id: 'hero', name: 'Hero Section', description: 'Large banner with title and subtitle' },
    { id: 'content', name: 'Content Block', description: 'Rich text content section' },
    { id: 'cards', name: 'Card Grid', description: 'Grid of cards with icons and descriptions' },
    { id: 'stats', name: 'Statistics', description: 'Numerical statistics display' },
    { id: 'gallery', name: 'Image Gallery', description: 'Photo gallery grid' },
    { id: 'contact', name: 'Contact Form', description: 'Contact information and form' },
    { id: 'accordion', name: 'Accordion', description: 'Collapsible content sections' },
    { id: 'grid', name: 'Info Grid', description: 'Grid layout for information' },
    { id: 'timeline', name: 'Timeline', description: 'Chronological timeline display' }
  ];

  useEffect(() => {
    loadSections();
  }, [pageId]);

  const loadSections = () => {
    const pageSections = getSectionsByPageId(pageId);
    setSections(pageSections);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const sectionData = {
        page_id: pageId,
        type: formData.type,
        title: formData.title,
        content: formData.content,
        data: formData.data,
        order_index: formData.order_index,
        is_active: formData.is_active
      };

      if (editingSection) {
        await updateSection(editingSection, sectionData);
        alert('Section updated successfully!');
      } else {
        await addSection(sectionData);
        alert('Section created successfully!');
      }
      
      resetForm();
      loadSections();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'content',
      title: '',
      content: '',
      data: {},
      order_index: 1,
      is_active: true
    });
    setEditingSection(null);
    setIsModalOpen(false);
  };

  const handleEdit = (section: PageSection) => {
    setFormData({
      type: section.type,
      title: section.title || '',
      content: section.content || '',
      data: section.data || {},
      order_index: section.order_index,
      is_active: section.is_active
    });
    setEditingSection(section.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        await deleteSection(id);
        loadSections();
        alert('Section deleted successfully!');
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section. Please try again.');
      }
    }
  };

  const handleDuplicate = async (section: PageSection) => {
    try {
      const duplicatedSection = {
        page_id: pageId,
        type: section.type,
        title: `${section.title} (Copy)`,
        content: section.content,
        data: section.data,
        order_index: sections.length + 1,
        is_active: section.is_active
      };
      
      await addSection(duplicatedSection);
      loadSections();
      alert('Section duplicated successfully!');
    } catch (error) {
      console.error('Error duplicating section:', error);
      alert('Error duplicating section. Please try again.');
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const section = sections.find(s => s.id === id);
      if (!section) return;
      
      await updateSection(id, { is_active: !section.is_active });
      loadSections();
    } catch (error) {
      console.error('Error toggling section:', error);
      alert('Error updating section. Please try again.');
    }
  };

  const renderDataEditor = () => {
    switch (formData.type) {
      case 'cards':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cards Data (JSON)
            </label>
            <textarea
              value={JSON.stringify(formData.data, null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value);
                  setFormData({ ...formData, data });
                } catch {
                  // Invalid JSON, keep typing
                }
              }}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={`{
  "cards": [
    {
      "title": "Card Title",
      "description": "Card description",
      "icon": "shield"
    }
  ]
}`}
            />
          </div>
        );
      
      case 'stats':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Statistics Data (JSON)
            </label>
            <textarea
              value={JSON.stringify(formData.data, null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value);
                  setFormData({ ...formData, data });
                } catch {
                  // Invalid JSON, keep typing
                }
              }}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={`{
  "stats": [
    {
      "value": "100+",
      "label": "Statistic Label",
      "description": "Description"
    }
  ]
}`}
            />
          </div>
        );
      
      case 'accordion':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accordion Items (JSON)
            </label>
            <textarea
              value={JSON.stringify(formData.data, null, 2)}
              onChange={(e) => {
                try {
                  const data = JSON.parse(e.target.value);
                  setFormData({ ...formData, data });
                } catch {
                  // Invalid JSON, keep typing
                }
              }}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder={`{
  "items": [
    {
      "title": "Accordion Title",
      "description": "Accordion content",
      "tags": ["tag1", "tag2"]
    }
  ]
}`}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Manage Page Sections</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sections List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Page Sections</h3>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Add Section</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {sections.length === 0 ? (
                <div className="text-center py-12">
                  <Layout className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Sections</h3>
                  <p className="text-gray-500">Add your first section to get started</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sections
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((section, index) => (
                    <div key={section.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium capitalize text-blue-600">
                            {section.type}
                          </span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                            #{section.order_index}
                          </span>
                          {!section.is_active && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => toggleActive(section.id)}
                            className="text-gray-400 hover:text-gray-600"
                            title={section.is_active ? 'Hide section' : 'Show section'}
                          >
                            {section.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={() => handleDuplicate(section)}
                            className="text-gray-400 hover:text-gray-600"
                            title="Duplicate section"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={() => handleEdit(section)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit section"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete section"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">
                        {section.title || `${section.type} Section`}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {section.content || 'No content'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Section Types */}
          <div className="w-1/2 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Available Section Types</h3>
              <p className="text-sm text-gray-600">Click to add a new section</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4">
                {sectionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setFormData({
                        type: type.id as PageSection['type'],
                        title: '',
                        content: '',
                        data: {},
                        order_index: sections.length + 1,
                        is_active: true
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <h4 className="font-medium text-gray-900 mb-1">{type.name}</h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSection ? 'Edit Section' : 'Add Section'}
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
                  Section Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as PageSection['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!!editingSection}
                >
                  {sectionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} - {type.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter section title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter section content (supports HTML)"
                />
              </div>

              {/* Dynamic data editor based on section type */}
              {(formData.type === 'cards' || formData.type === 'stats' || formData.type === 'accordion' || formData.type === 'grid') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Data (JSON)
                  </label>
                  <textarea
                    value={JSON.stringify(formData.data, null, 2)}
                    onChange={(e) => {
                      try {
                        const data = JSON.parse(e.target.value);
                        setFormData({ ...formData, data });
                      } catch {
                        // Invalid JSON, keep typing
                      }
                    }}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder={getDataPlaceholder(formData.type)}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter valid JSON data for this section type
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
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
                  <span>{editingSection ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const getDataPlaceholder = (type: string): string => {
  switch (type) {
    case 'cards':
      return `{
  "cards": [
    {
      "title": "Card Title",
      "description": "Card description",
      "icon": "shield"
    }
  ]
}`;
    case 'stats':
      return `{
  "stats": [
    {
      "value": "100+",
      "label": "Statistic Label", 
      "description": "Description"
    }
  ]
}`;
    case 'accordion':
      return `{
  "items": [
    {
      "title": "Accordion Title",
      "description": "Accordion content",
      "tags": ["tag1", "tag2"]
    }
  ]
}`;
    case 'grid':
      return `{
  "items": [
    {
      "title": "Grid Item",
      "description": "Item description",
      "count": "10"
    }
  ]
}`;
    default:
      return '{}';
  }
};

export default PageSectionManager;