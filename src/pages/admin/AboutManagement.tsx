import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload, Users, Building } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface OrganizationalHierarchy {
  id: string;
  name: string;
  designation: string;
  photo?: string;
  department: string;
  level: number;
  parent_id?: string;
  order_index: number;
  is_active: boolean;
}

interface KeyPersonnel {
  id: string;
  name: string;
  designation: string;
  photo?: string;
  bio?: string;
  email?: string;
  phone?: string;
  department: string;
  order_index: number;
  is_featured: boolean;
  is_active: boolean;
}

interface AboutSection {
  id: string;
  title: string;
  content: string;
  image?: string;
  order_index: number;
  is_active: boolean;
}

const AboutManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sections' | 'hierarchy' | 'personnel'>('sections');
  
  // About Sections State
  const [aboutSections, setAboutSections] = useState<AboutSection[]>([]);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionFormData, setSectionFormData] = useState({
    title: '',
    content: '',
    image: '',
    order_index: 1,
    is_active: true
  });

  // Organizational Hierarchy State
  const [hierarchy, setHierarchy] = useState<OrganizationalHierarchy[]>([]);
  const [isHierarchyModalOpen, setIsHierarchyModalOpen] = useState(false);
  const [editingHierarchyId, setEditingHierarchyId] = useState<string | null>(null);
  const [hierarchyFormData, setHierarchyFormData] = useState({
    name: '',
    designation: '',
    photo: '',
    department: '',
    level: 1,
    parent_id: '',
    order_index: 1,
    is_active: true
  });

  // Key Personnel State
  const [personnel, setPersonnel] = useState<KeyPersonnel[]>([]);
  const [isPersonnelModalOpen, setIsPersonnelModalOpen] = useState(false);
  const [editingPersonnelId, setEditingPersonnelId] = useState<string | null>(null);
  const [personnelFormData, setPersonnelFormData] = useState({
    name: '',
    designation: '',
    photo: '',
    bio: '',
    email: '',
    phone: '',
    department: '',
    order_index: 1,
    is_featured: false,
    is_active: true
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchAboutSections(),
        fetchHierarchy(),
        fetchPersonnel()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // About Sections Functions
  const fetchAboutSections = async () => {
    try {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "about_sections" does not exist')) {
        throw error;
      }
      
      setAboutSections(data || []);
    } catch (error) {
      console.error('Error fetching about sections:', error);
    }
  };

  const handleSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSectionId) {
        const { data, error } = await supabase
          .from('about_sections')
          .update(sectionFormData)
          .eq('id', editingSectionId)
          .select()
          .single();

        if (error) throw error;
        
        setAboutSections(prev => prev.map(section => 
          section.id === editingSectionId ? data : section
        ));
        alert('Section updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('about_sections')
          .insert([sectionFormData])
          .select()
          .single();

        if (error) throw error;
        
        setAboutSections(prev => [...prev, data]);
        alert('Section created successfully!');
      }
      
      resetSectionForm();
    } catch (error) {
      console.error('Error saving section:', error);
      alert('Error saving section. Please try again.');
    }
  };

  const resetSectionForm = () => {
    setSectionFormData({
      title: '',
      content: '',
      image: '',
      order_index: 1,
      is_active: true
    });
    setEditingSectionId(null);
    setIsSectionModalOpen(false);
  };

  // Organizational Hierarchy Functions
  const fetchHierarchy = async () => {
    try {
      const { data, error } = await supabase
        .from('organizational_hierarchy')
        .select('*')
        .order('level', { ascending: true })
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "organizational_hierarchy" does not exist')) {
        throw error;
      }
      
      setHierarchy(data || []);
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
    }
  };

  const handleHierarchySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = {
        ...hierarchyFormData,
        parent_id: hierarchyFormData.parent_id || null
      };

      if (editingHierarchyId) {
        const { data, error } = await supabase
          .from('organizational_hierarchy')
          .update(formData)
          .eq('id', editingHierarchyId)
          .select()
          .single();

        if (error) throw error;
        
        setHierarchy(prev => prev.map(item => 
          item.id === editingHierarchyId ? data : item
        ));
        alert('Hierarchy item updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('organizational_hierarchy')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        
        setHierarchy(prev => [...prev, data]);
        alert('Hierarchy item created successfully!');
      }
      
      resetHierarchyForm();
    } catch (error) {
      console.error('Error saving hierarchy:', error);
      alert('Error saving hierarchy item. Please try again.');
    }
  };

  const resetHierarchyForm = () => {
    setHierarchyFormData({
      name: '',
      designation: '',
      photo: '',
      department: '',
      level: 1,
      parent_id: '',
      order_index: 1,
      is_active: true
    });
    setEditingHierarchyId(null);
    setIsHierarchyModalOpen(false);
  };

  // Key Personnel Functions
  const fetchPersonnel = async () => {
    try {
      const { data, error } = await supabase
        .from('key_personnel')
        .select('*')
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "key_personnel" does not exist')) {
        throw error;
      }
      
      setPersonnel(data || []);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const handlePersonnelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPersonnelId) {
        const { data, error } = await supabase
          .from('key_personnel')
          .update(personnelFormData)
          .eq('id', editingPersonnelId)
          .select()
          .single();

        if (error) throw error;
        
        setPersonnel(prev => prev.map(person => 
          person.id === editingPersonnelId ? data : person
        ));
        alert('Personnel updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('key_personnel')
          .insert([personnelFormData])
          .select()
          .single();

        if (error) throw error;
        
        setPersonnel(prev => [...prev, data]);
        alert('Personnel created successfully!');
      }
      
      resetPersonnelForm();
    } catch (error) {
      console.error('Error saving personnel:', error);
      alert('Error saving personnel. Please try again.');
    }
  };

  const resetPersonnelForm = () => {
    setPersonnelFormData({
      name: '',
      designation: '',
      photo: '',
      bio: '',
      email: '',
      phone: '',
      department: '',
      order_index: 1,
      is_featured: false,
      is_active: true
    });
    setEditingPersonnelId(null);
    setIsPersonnelModalOpen(false);
  };

  // Delete Functions
  const handleDeleteSection = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      try {
        const { error } = await supabase
          .from('about_sections')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setAboutSections(prev => prev.filter(section => section.id !== id));
        alert('Section deleted successfully!');
      } catch (error) {
        console.error('Error deleting section:', error);
        alert('Error deleting section. Please try again.');
      }
    }
  };

  const handleDeleteHierarchy = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hierarchy item?')) {
      try {
        const { error } = await supabase
          .from('organizational_hierarchy')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setHierarchy(prev => prev.filter(item => item.id !== id));
        alert('Hierarchy item deleted successfully!');
      } catch (error) {
        console.error('Error deleting hierarchy item:', error);
        alert('Error deleting hierarchy item. Please try again.');
      }
    }
  };

  const handleDeletePersonnel = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this personnel?')) {
      try {
        const { error } = await supabase
          .from('key_personnel')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setPersonnel(prev => prev.filter(person => person.id !== id));
        alert('Personnel deleted successfully!');
      } catch (error) {
        console.error('Error deleting personnel:', error);
        alert('Error deleting personnel. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading about page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">About Page Management</h1>
          <p className="text-gray-600">Manage about page content, organizational hierarchy, and key personnel</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'sections', label: 'About Sections', icon: Building },
            { id: 'hierarchy', label: 'Organizational Hierarchy', icon: Users },
            { id: 'personnel', label: 'Key Personnel', icon: Users }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* About Sections Tab */}
      {activeTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">About Sections</h2>
            <button
              onClick={() => setIsSectionModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Section</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutSections
              .sort((a, b) => a.order_index - b.order_index)
              .map((section) => (
              <div key={section.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{section.title}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Order: {section.order_index}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      section.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {section.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setSectionFormData({
                          title: section.title,
                          content: section.content,
                          image: section.image || '',
                          order_index: section.order_index,
                          is_active: section.is_active
                        });
                        setEditingSectionId(section.id);
                        setIsSectionModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteSection(section.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {section.content}
                </p>
                
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Organizational Hierarchy Tab */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Organizational Hierarchy</h2>
            <button
              onClick={() => setIsHierarchyModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Position</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hierarchy
              .sort((a, b) => a.level - b.level || a.order_index - b.order_index)
              .map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.photo || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.designation}</p>
                      <p className="text-xs text-gray-500">{item.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setHierarchyFormData({
                          name: item.name,
                          designation: item.designation,
                          photo: item.photo || '',
                          department: item.department,
                          level: item.level,
                          parent_id: item.parent_id || '',
                          order_index: item.order_index,
                          is_active: item.is_active
                        });
                        setEditingHierarchyId(item.id);
                        setIsHierarchyModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteHierarchy(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Level {item.level}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    item.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Personnel Tab */}
      {activeTab === 'personnel' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Key Personnel</h2>
            <button
              onClick={() => setIsPersonnelModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus size={20} />
              <span>Add Personnel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {personnel
              .sort((a, b) => a.order_index - b.order_index)
              .map((person) => (
              <div key={person.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={person.photo || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{person.name}</h3>
                      <p className="text-sm text-gray-600">{person.designation}</p>
                      <p className="text-xs text-gray-500">{person.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setPersonnelFormData({
                          name: person.name,
                          designation: person.designation,
                          photo: person.photo || '',
                          bio: person.bio || '',
                          email: person.email || '',
                          phone: person.phone || '',
                          department: person.department,
                          order_index: person.order_index,
                          is_featured: person.is_featured,
                          is_active: person.is_active
                        });
                        setEditingPersonnelId(person.id);
                        setIsPersonnelModalOpen(true);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeletePersonnel(person.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                {person.bio && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {person.bio}
                  </p>
                )}
                
                <div className="space-y-1">
                  {person.email && (
                    <p className="text-xs text-gray-500">📧 {person.email}</p>
                  )}
                  {person.phone && (
                    <p className="text-xs text-gray-500">📞 {person.phone}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  {person.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    person.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {person.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Modal */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingSectionId ? 'Edit Section' : 'Add Section'}
                </h2>
                <button
                  onClick={resetSectionForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSectionSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={sectionFormData.title}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={sectionFormData.content}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={sectionFormData.image}
                  onChange={(e) => setSectionFormData({ ...sectionFormData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={sectionFormData.order_index}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, order_index: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={sectionFormData.is_active ? 'active' : 'inactive'}
                    onChange={(e) => setSectionFormData({ ...sectionFormData, is_active: e.target.value === 'active' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetSectionForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingSectionId ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hierarchy Modal */}
      {isHierarchyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingHierarchyId ? 'Edit Position' : 'Add Position'}
                </h2>
                <button
                  onClick={resetHierarchyForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleHierarchySubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={hierarchyFormData.name}
                    onChange={(e) => setHierarchyFormData({ ...hierarchyFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={hierarchyFormData.designation}
                    onChange={(e) => setHierarchyFormData({ ...hierarchyFormData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={hierarchyFormData.photo}
                  onChange={(e) => setHierarchyFormData({ ...hierarchyFormData, photo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={hierarchyFormData.department}
                    onChange={(e) => setHierarchyFormData({ ...hierarchyFormData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <input
                    type="number"
                    value={hierarchyFormData.level}
                    onChange={(e) => setHierarchyFormData({ ...hierarchyFormData, level: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetHierarchyForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingHierarchyId ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Personnel Modal */}
      {isPersonnelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPersonnelId ? 'Edit Personnel' : 'Add Personnel'}
                </h2>
                <button
                  onClick={resetPersonnelForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handlePersonnelSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={personnelFormData.name}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={personnelFormData.designation}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, designation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={personnelFormData.photo}
                  onChange={(e) => setPersonnelFormData({ ...personnelFormData, photo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={personnelFormData.bio}
                  onChange={(e) => setPersonnelFormData({ ...personnelFormData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief biography and experience"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={personnelFormData.email}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={personnelFormData.phone}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={personnelFormData.department}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Order
                  </label>
                  <input
                    type="number"
                    value={personnelFormData.order_index}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, order_index: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={personnelFormData.is_featured}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured Personnel</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={personnelFormData.is_active}
                    onChange={(e) => setPersonnelFormData({ ...personnelFormData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetPersonnelForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save size={16} />
                  <span>{editingPersonnelId ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutManagement;