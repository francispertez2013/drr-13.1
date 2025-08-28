import React, { useState } from 'react';
import { Plus, 
  Calendar, 
  Send, 
  Eye, 
  Edit, 
  Trash2, 
  BarChart3,
  Users,
  TrendingUp,
  MessageCircle,
  Heart,
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  X,
  Save
} from 'lucide-react';
import { supabase } from "../../lib/supabase";

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  image?: string;
  link?: string;
  scheduledTime?: string;
  scheduled_time?: string;
  status: 'draft' | 'scheduled' | 'published';
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

const SocialMediaManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'schedule' | 'analytics'>('overview');
  const [scheduledPosts, setScheduledPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: 'facebook' as 'facebook' | 'twitter' | 'instagram' | 'youtube',
    content: '',
    image: '',
    link: '',
    scheduledTime: '',
    status: 'draft' as 'draft' | 'scheduled' | 'published'
  });

  React.useEffect(() => {
    fetchSocialPosts();
  }, []);

  const fetchSocialPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error && !error.message.includes('relation "social_posts" does not exist')) {
        throw error;
      }
      
      if (data && data.length > 0) {
        setScheduledPosts(data);
      } else {
        // Fallback to sample data
        setScheduledPosts([
          {
            id: '1',
            platform: 'facebook',
            content: 'BDRRM Planning Training Workshop completed successfully! 🎯 Thank you to all barangay officials who participated.',
            image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
            status: 'published',
            engagement: { likes: 45, shares: 12, comments: 8 }
          },
          {
            id: '2',
            platform: 'twitter',
            content: 'Nationwide Earthquake Drill: Over 5,000 participants joined our community preparedness exercise! 🏢 #DisasterPreparedness #PioDuran',
            status: 'published',
            engagement: { likes: 23, shares: 18, comments: 5 }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching social posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPost) {
        const { data, error } = await supabase
          .from('social_posts')
          .update({
            platform: formData.platform,
            content: formData.content,
            image: formData.image || null,
            link: formData.link || null,
            scheduled_time: formData.scheduledTime || null,
            status: formData.status
          })
          .eq('id', editingPost)
          .select()
          .single();

        if (error) throw error;
        
        setScheduledPosts(prev => prev.map(post => 
          post.id === editingPost ? data : post
        ));
        alert('Social post updated successfully!');
      } else {
        const { data, error } = await supabase
          .from('social_posts')
          .insert([{
            platform: formData.platform,
            content: formData.content,
            image: formData.image || null,
            link: formData.link || null,
            scheduled_time: formData.scheduledTime || null,
            status: formData.status,
            engagement: { likes: 0, shares: 0, comments: 0 }
          }])
          .select()
          .single();

        if (error) throw error;
        
        setScheduledPosts(prev => [data, ...prev]);
        alert('Social post created successfully!');
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving social post:', error);
      alert('Error saving social post. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      platform: 'facebook',
      content: '',
      image: '',
      link: '',
      scheduledTime: '',
      status: 'draft'
    });
    setEditingPost(null);
    setIsModalOpen(false);
  };

  const handleEdit = (post: SocialPost) => {
    setFormData({
      platform: post.platform,
      content: post.content,
      image: post.image || '',
      link: post.link || '',
      scheduledTime: post.scheduled_time || '',
      status: post.status
    });
    setEditingPost(post.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const { error } = await supabase
          .from('social_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        setScheduledPosts(prev => prev.filter(post => post.id !== id));
        alert('Social post deleted successfully!');
      } catch (error) {
        console.error('Error deleting social post:', error);
        alert('Error deleting social post. Please try again.');
      }
    }
  };

  const socialStats = {
    totalFollowers: 8342,
    monthlyReach: 15600,
    engagement: 4.2,
    postsThisMonth: 24
  };

  const platformStats = [
    { platform: 'Facebook', followers: 2500, engagement: 4.8, posts: 8, color: 'bg-blue-600', icon: Facebook },
    { platform: 'Twitter', followers: 1800, engagement: 3.2, posts: 12, color: 'bg-sky-500', icon: Twitter },
    { platform: 'Instagram', followers: 3200, engagement: 5.1, posts: 6, color: 'bg-pink-600', icon: Instagram },
    { platform: 'YouTube', followers: 842, engagement: 6.3, posts: 2, color: 'bg-red-600', icon: Youtube }
  ];

  const handleDeletePost = (id: string) => {
    if (window.confirm('Are you sure you want to delete this scheduled post?')) {
      setScheduledPosts(prev => prev.filter(post => post.id !== id));
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media Management</h1>
          <p className="text-gray-600">Manage your social media presence and engagement</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'posts', label: 'Manage Posts', icon: Edit },
            { id: 'schedule', label: 'Scheduled Posts', icon: Calendar },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Followers</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(socialStats.totalFollowers)}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Monthly Reach</p>
                  <p className="text-3xl font-bold text-gray-900">{formatNumber(socialStats.monthlyReach)}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Engagement Rate</p>
                  <p className="text-3xl font-bold text-gray-900">{socialStats.engagement}%</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Posts This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{socialStats.postsThisMonth}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Send className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Platform Performance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {platformStats.map((platform) => (
                <div key={platform.platform} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`${platform.color} p-2 rounded-lg`}>
                      <platform.icon size={16} className="text-white" />
                    </div>
                    <span className="font-medium text-gray-900">{platform.platform}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Followers</span>
                      <span className="font-medium">{formatNumber(platform.followers)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Engagement</span>
                      <span className="font-medium text-green-600">{platform.engagement}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Posts</span>
                      <span className="font-medium">{platform.posts}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Posts Management */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Manage Posts</h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={16} />
                <span>New Post</span>
              </button>
            </div>
          </div>
          <div className="p-6">
            {scheduledPosts.length > 0 ? (
              <div className="space-y-4">
                {scheduledPosts.map((post) => {
                  const config = platformStats.find(p => p.platform.toLowerCase() === post.platform);
                  return (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className={`${config?.color} p-2 rounded-lg`}>
                          {config && <config.icon size={16} className="text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{config?.platform}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                post.status === 'published' ? 'bg-green-100 text-green-800' : 
                                post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {post.status}
                              </span>
                              <button
                                onClick={() => handleEdit(post)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(post.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{post.content}</p>
                          {post.image && (
                            <img 
                              src={post.image} 
                              alt="Post"
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Heart size={14} />
                              <span>{post.engagement?.likes || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Share2 size={14} />
                              <span>{post.engagement?.shares || 0}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle size={14} />
                              <span>{post.engagement?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Share2 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Posts Yet</h3>
                <p className="text-gray-500">Create your first social media post.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduled Posts</h3>
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Posts</h3>
            <p className="text-gray-500">Create a new post to schedule it for later.</p>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Analytics</h3>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Analytics chart would be displayed here</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">BDRRM Training Workshop</p>
                  <p className="text-xs text-gray-500">45 likes • 12 shares • 8 comments</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">Water Rescue Training</p>
                  <p className="text-xs text-gray-500">67 likes • 8 shares • 12 comments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Insights</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 25-34</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 35-44</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Age 45-54</span>
                  <span className="text-sm font-medium">22%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingPost ? 'Edit Social Post' : 'Create Social Post'}
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
                  Platform
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Write your social media post content..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
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
                  <Plus size={16} />
                  <span>{editingPost ? 'Update' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagement;