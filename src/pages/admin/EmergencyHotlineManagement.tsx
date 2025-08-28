import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Phone, Building, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface EmergencyHotline {
  id: string;
  contact_name: string;
  phone_number: string;
  logo?: string;
  department: string;
  description?: string;
  is_primary: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const EmergencyHotlineManagement: React.FC = () => {
  const [hotlines, setHotlines] = useState<EmergencyHotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    contact_name: '',
    phone_number: '',
    logo: '',
    department: '',
    description: '',
    is_primary: false,
    order_index: 1,
    is_active: true
  });

  useEffect(() => {
    fetchHotlines();
  }, []);

  const fetchHotlines = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_hotlines')
        .select('*')
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "emergency_hotlines" does not exist')) {
        throw error;
      }
      
      setHotlines(data || []);
    } catch (error) {
      console.error('Error fetching hotlines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        const { data, error } = await supabase
          .from('emergency_hotlines')
          .update(formData)
          .eq('id', editingId)
          .select()
          .single();

        if (error) throw error;
        
        setHotlines(prev => prev.map(hotline => 
          hotline.id === editingId ? data : hotline
        ));
        alert('Hotline updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('emergency_hotlines')
          .insert([formData])
          .select()
          .single();

        if (error) throw error;
        
        setHotlines(prev => [...prev, data]);
        alert('Hotline created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving hotline:', error);
      alert('Error saving hotline. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      contact_name: '',
      phone_number: '',
      logo: '',
      department: '',
      description: '',
      is_primary: false,
      order_index: 1,
      is_active: true
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (hotline: EmergencyHotline) => {
    setFormData({
      contact_name: hotline.contact_name,
      phone_number: hotline.phone_number,
      logo: hotline.logo || '',
      department: hotline.department,
      description: hotline.description || '',
      is_primary: hotline.is_primary,
      order_index: hotline.order_index,
      is_active: hotline.is_active
    });
    setEditingId(hotline.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this hotline?')) {
      try {
        const { error } = await supabase
          .from('emergency_hotlines')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setHotlines(prev => prev.filter(hotline => hotline.id !== id));
        alert('Hotline deleted successfully!');
      } catch (error) {
        console.error('Error deleting hotline:', error);
        alert('Error deleting hotline. Please try again.');
      }
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const hotline = hotlines.find(h => h.id === id);
      if (!hotline) return;
      
      const { error } = await supabase
        .from('emergency_hotlines')
        .update({ is_active: !hotline.is_active })
        .eq('id', id);

      if (error) throw error;
      
      setHotlines(prev => prev.map(hotline => 
        hotline.id === id 
          ? { ...hotline, is_active: !hotline.is_active }
          : hotline
      ));
    } catch (error) {
      console.error('Error toggling hotline status:', error);
      alert('Error updating hotline status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Emergency Hotlines Management</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading emergency hotlines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Emergency Hotlines Management</h1>
          <p className="text-gray-600">Manage emergency contact numbers and hotlines</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Hotline</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hotlines</p>
              <p className="text-3xl font-bold text-gray-900">{hotlines.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-3xl font-bold text-green-600">
                {hotlines.filter(h => h.is_active).length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <Phone className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Primary</p>
              <p className="text-3xl font-bold text-yellow-600">
                {hotlines.filter(h => h.is_primary).length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-purple-600">
                {new Set(hotlines.map(h => h.department)).size}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Building className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Hotlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotlines
          .sort((a, b) => a.order_index - b.order_index)
          .map((hotline) => (
          <div key={hotline.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <img
                  src={hotline.logo || 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp'}
                  alt={hotline.contact_name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{hotline.contact_name}</h3>
                  <p className="text-sm text-gray-600">{hotline.department}</p>
                  <p className="text-lg font-bold text-blue-600">{hotline.phone_number}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(hotline)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(hotline.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {hotline.description && (
              <p className="text-gray-600 text-sm mb-4">
                {hotline.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {hotline.is_primary && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    Primary
                  </span>
                )}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  Order: {hotline.order_index}
                </span>
              </div>
              
              <button
                onClick={() => toggleActive(hotline.id)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  hotline.is_active
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {hotline.is_active ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Edit Emergency Hotline' : 'Add Emergency Hotline'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo URL
                </label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description of this emergency contact"
                />
              </div>

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

                <div className="flex items-center space-x-4 pt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_primary}
                      onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">Primary</span>
                  </label>

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

              <div className="flex justify-end space-x-3 pt-4">
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
                  <span>{editingId ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyHotlineManagement;