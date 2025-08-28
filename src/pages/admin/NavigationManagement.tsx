import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Menu, Eye, EyeOff, ArrowUp, ArrowDown, ChevronRight, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  order_index: number;
  is_active: boolean;
  is_featured: boolean;
  parent_id?: string;
  created_at: string;
  updated_at: string;
}

const NavigationManagement: React.FC = () => {
  const [navItems, setNavItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    label: '',
    path: '',
    icon: 'Home',
    parent_id: '',
    order_index: 1,
    is_active: true,
    is_featured: false,
  });

  const iconOptions = [
    'Home', 'Info', 'Wrench', 'Newspaper', 'FolderOpen', 
    'Calendar', 'Camera', 'Phone', 'Shield', 'Users', 
    'Settings', 'FileText', 'Download', 'MapPin', 'AlertTriangle',
    'Bell', 'Cloud', 'Database', 'Globe', 'Heart', 'Lock',
    'Mail', 'Monitor', 'Navigation', 'Palette', 'Play',
    'Radio', 'Search', 'Share2', 'Star', 'Target', 'Tool',
    'Truck', 'Video', 'Wifi', 'Zap', 'Activity', 'Archive',
    'Award', 'Bookmark', 'Building', 'CheckCircle', 'Clock',
    'Code', 'Compass', 'CreditCard', 'Edit', 'Eye', 'Filter',
    'Flag', 'Gift', 'Grid', 'HelpCircle', 'Image', 'Key',
    'Layers', 'Link', 'List', 'MessageCircle', 'Mic', 'Move',
    'Package', 'PieChart', 'Plus', 'Power', 'Printer', 'Refresh',
    'Save', 'Send', 'Server', 'Sliders', 'Smartphone', 'Tag',
    'Terminal', 'Trash2', 'TrendingUp', 'Upload', 'Volume2', 'Wifi'
  ];

  useEffect(() => {
    fetchNavigationItems();
  }, []);

  const fetchNavigationItems = async () => {
    try {
      const { data, error } = await supabase
        .from('navigation_items')
        .select('*')
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "navigation_items" does not exist')) {
        throw error;
      }
      
      setNavItems(data || []);
    } catch (error) {
      console.error('Error fetching navigation items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        parent_id: formData.parent_id || null
      };

      if (editingItem) {
        const { data, error } = await supabase
          .from('navigation_items')
          .update(itemData)
          .eq('id', editingItem)
          .select()
          .single();

        if (error) throw error;
        
        setNavItems(prev => prev.map(item => 
          item.id === editingItem ? data : item
        ));
        alert('Navigation item updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('navigation_items')
          .insert([itemData])
          .select()
          .single();

        if (error) throw error;
        
        setNavItems(prev => [...prev, data]);
        alert('Navigation item created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving navigation item:', error);
      alert('Error saving navigation item. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      path: '',
      icon: 'Home',
      parent_id: '',
      order_index: 1,
      is_active: true,
      is_featured: false,
    });
    setEditingItem(null);
    setIsModalOpen(false);
  };

  const handleEdit = (item: NavigationItem) => {
    setFormData({
      label: item.label,
      path: item.path,
      icon: item.icon,
      parent_id: item.parent_id || '',
      order_index: item.order_index,
      is_active: item.is_active,
      is_featured: item.is_featured,
    });
    setEditingItem(item.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this navigation item?')) {
      try {
        const { error } = await supabase
          .from('navigation_items')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setNavItems(prev => prev.filter(item => item.id !== id));
        alert('Navigation item deleted successfully!');
      } catch (error) {
        console.error('Error deleting navigation item:', error);
        alert('Error deleting navigation item. Please try again.');
      }
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const item = navItems.find(i => i.id === id);
      if (!item) return;
      
      const { error } = await supabase
        .from('navigation_items')
        .update({ is_active: !item.is_active })
        .eq('id', id);

      if (error) throw error;
      
      setNavItems(prev => prev.map(item => 
        item.id === id 
          ? { ...item, is_active: !item.is_active }
          : item
      ));
    } catch (error) {
      console.error('Error toggling navigation item:', error);
      alert('Error updating navigation item. Please try again.');
    }
  };

  const moveItem = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = navItems.findIndex(item => item.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= navItems.length) return;

    try {
      const currentItem = navItems[currentIndex];
      const swapItem = navItems[newIndex];

      await Promise.all([
        supabase
          .from('navigation_items')
          .update({ order_index: swapItem.order_index })
          .eq('id', currentItem.id),
        supabase
          .from('navigation_items')
          .update({ order_index: currentItem.order_index })
          .eq('id', swapItem.id)
      ]);

      // Update local state
      const newItems = [...navItems];
      [newItems[currentIndex], newItems[newIndex]] = [newItems[newIndex], newItems[currentIndex]];
      setNavItems(newItems);
    } catch (error) {
      console.error('Error reordering navigation items:', error);
      alert('Error reordering navigation items. Please try again.');
    }
  };

  const buildNavigationTree = (items: NavigationItem[]) => {
    const tree: any[] = [];
    const itemMap = new Map();
    
    // Create a map of all items
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });
    
    // Build the tree structure
    items.forEach(item => {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id);
        if (parent) {
          parent.children.push(itemMap.get(item.id));
        }
      } else {
        tree.push(itemMap.get(item.id));
      }
    });
    
    return tree;
  };

  const renderNavigationTree = (items: any[], level: number = 0) => {
    return items.map((item) => (
      <div key={item.id} className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''}`}>
        <div className="p-6 hover:bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => moveItem(item.id, 'up')}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={() => moveItem(item.id, 'down')}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
              
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Menu className="text-blue-600" size={20} />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-gray-900">{item.label}</h3>
                  {item.children.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.children.length} submenu{item.children.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{item.path}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Order: {item.order_index}
                  </span>
                  {item.is_featured && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      Featured
                    </span>
                  )}
                  {level > 0 && (
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Submenu
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleActive(item.id)}
                className={`p-2 rounded-lg transition-colors ${
                  item.is_active
                    ? 'text-green-600 hover:bg-green-100'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
                title={item.is_active ? 'Hide from navigation' : 'Show in navigation'}
              >
                {item.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="text-red-600 hover:text-red-800"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Render children */}
        {item.children.length > 0 && (
          <div className="border-l-2 border-gray-100">
            {renderNavigationTree(item.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  const navigationTree = buildNavigationTree(navItems);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Navigation Management</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading navigation items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Navigation Management</h1>
          <p className="text-gray-600">Manage website navigation menu items</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Navigation Item</span>
        </button>
      </div>

      {/* Navigation Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Navigation Items</h3>
          <p className="text-sm text-gray-600">Manage navigation structure with submenus</p>
        </div>
        
        <div>
          {renderNavigationTree(navigationTree)}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Edit Navigation Item' : 'Add Navigation Item'}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Path
                </label>
                <input
                  type="text"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="/example-page"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Menu (Optional)
                </label>
                <select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">No Parent (Top Level)</option>
                  {navItems
                    .filter(item => item.id !== editingItem && !item.parent_id)
                    .map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Select a parent menu to create a submenu item
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
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

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Featured</span>
                </label>
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
                  <span>{editingItem ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavigationManagement;