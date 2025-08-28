import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Shield, User, Eye, EyeOff, AlertTriangle, Key } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface UserData {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  status: 'active' | 'inactive';
  last_login: string;
  created_at: string;
  updated_at: string;
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    role: 'editor' as 'admin' | 'editor',
    status: 'active' as 'active' | 'inactive',
    password: '',
    confirmPassword: ''
  });

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && !error.message.includes('relation "users" does not exist')) {
        throw error;
      }
      
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saveUser = async () => {
      try {
        setIsProcessing(true);

        if (editingUser) {
          // Update existing user (excluding password)
          const updateData = {
            name: formData.name,
            username: formData.username,
            email: formData.email,
            role: formData.role,
            status: formData.status
          };
          
          const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', editingUser)
            .select()
            .single();

          if (error) throw error;
          
          setUsers(prev => prev.map(user => 
            user.id === editingUser ? data : user
          ));
          
          // Handle password update separately if provided
          if (formData.password) {
            try {
              // Call the database function to update password
              const { error: passwordError } = await supabase.rpc('update_user_password', {
                p_user_id: editingUser,
                p_new_password: formData.password
              });
              
              if (passwordError) {
                console.warn('Password update failed:', passwordError);
                alert('User updated but password change failed. Please try updating password separately.');
              } else {
                alert('User and password updated successfully!');
              }
            } catch (passwordError) {
              console.warn('Password update error:', passwordError);
              alert('User updated but password change failed. Please try updating password separately.');
            }
          } else {
            alert('User updated successfully!');
          }
        } else {
          // Create new user
          if (!formData.password) {
            alert('Password is required for new users');
            return;
          }
          if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
          }
          if (formData.password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
          }

          // First create Supabase Auth user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password
          });

          if (authError) {
            console.error('Auth user creation error:', authError);
            alert('Failed to create authentication account: ' + authError.message);
            return;
          }

          if (!authData.user) {
            alert('Failed to create authentication account');
            return;
          }

          // Then create user record in database
          const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([{
              id: authData.user.id,
              username: formData.username,
              email: formData.email,
              name: formData.name,
              role: formData.role,
              status: formData.status,
              password_hash: 'managed_by_supabase_auth'
            }])
            .select()
            .single();

          if (userError) {
            console.error('Database user creation error:', userError);
            // Clean up auth user if database insert fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            alert('Failed to create user profile: ' + userError.message);
            return;
          }

          setUsers(prev => [userData, ...prev]);
          alert('User updated successfully!');
          alert('User created successfully!');
        }
        
        resetForm();
      } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    };

    saveUser();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      email: '',
      role: 'editor',
      status: 'active',
      password: '',
      confirmPassword: ''
    });
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const handleEdit = (user: UserData) => {
    setFormData({
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      password: '',
      confirmPassword: ''
    });
    setEditingUser(user.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their authentication account.')) {
      try {
        // First delete from users table
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        // Then delete from Supabase Auth (requires service role)
        const { error: authError } = await supabase.auth.admin.deleteUser(id);
        if (authError) {
          console.warn('Could not delete auth user:', authError);
        }
        
        setUsers(prev => prev.filter(user => user.id !== id));
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      const user = users.find(u => u.id === id);
      if (!user) return;
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setUsers(prev => prev.map(user => 
        user.id === id 
          ? { ...user, status: newStatus }
          : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Error updating user status. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage admin users and their permissions</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add User</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {user.role === 'admin' ? (
                        <Shield className="h-4 w-4 text-red-500" />
                      ) : (
                        <User className="h-4 w-4 text-blue-500" />
                      )}
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-800"
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
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingUser ? 'Edit User' : 'Add User'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {editingUser ? '(leave blank to keep current)' : '(required)'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    required={!editingUser}
                    minLength={6}
                    placeholder={editingUser ? 'Leave blank to keep current' : 'Minimum 6 characters'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {!editingUser && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              {!editingUser && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required={!editingUser}
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              {!editingUser && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="text-yellow-600 mr-2 mt-0.5" size={16} />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-1">Account Creation Notice:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>User will receive an email verification link</li>
                        <li>Account will be active immediately after creation</li>
                        <li>User can change password after first login</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'admin' | 'editor' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
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
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : editingUser ? 'Update User' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;