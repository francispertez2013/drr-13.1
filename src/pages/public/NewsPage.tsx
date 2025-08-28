import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, Tag, Eye, Share2, ArrowRight, Clock, User, Users, Phone, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';
import SocialShareButtons from '../../components/SocialShareButtons';

const NewsPage: React.FC = () => {
  const { news } = useData();
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const publishedNews = news.filter(article => article.status === 'published');
  
  // Add sample news if none exist
  const sampleNews = publishedNews.length === 0 ? [
    {
      id: 'sample-1',
      title: 'MDRRMO Pio Duran Launches New Emergency Response System',
      excerpt: 'Advanced emergency response protocols now in place to better serve our community during disasters.',
      content: 'The Municipal Disaster Risk Reduction and Management Office of Pio Duran has successfully launched a comprehensive emergency response system designed to enhance our community\'s preparedness and response capabilities.',
      image: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
      author: 'MDRRMO Operations Team',
      status: 'published' as const,
      date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'sample-2',
      title: 'Community Earthquake Drill Scheduled for Next Week',
      excerpt: 'All residents are encouraged to participate in the municipality-wide earthquake preparedness drill.',
      content: 'As part of our ongoing commitment to disaster preparedness, MDRRMO Pio Duran will conduct a comprehensive earthquake drill next week.',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      author: 'Training Coordinator',
      status: 'published' as const,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 86400000).toISOString(),
      updated_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'sample-3',
      title: 'Weather Monitoring System Upgrade Complete',
      excerpt: 'Enhanced weather monitoring capabilities now provide more accurate forecasts and early warnings.',
      content: 'MDRRMO Pio Duran has completed the upgrade of our weather monitoring system, featuring advanced sensors and real-time data collection.',
      image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg',
      author: 'Weather Operations Team',
      status: 'published' as const,
      date: new Date(Date.now() - 432000000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 432000000).toISOString(),
      updated_at: new Date(Date.now() - 432000000).toISOString()
    },
    {
      id: 'sample-4',
      title: 'New Mobile Emergency App Now Available',
      excerpt: 'Download the official MDRRMO mobile app for instant access to emergency services and real-time alerts.',
      content: 'We are excited to announce the launch of the official MDRRMO Pio Duran mobile application.',
      image: 'https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg',
      author: 'Digital Services Team',
      status: 'published' as const,
      date: new Date(Date.now() - 604800000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 604800000).toISOString(),
      updated_at: new Date(Date.now() - 604800000).toISOString()
    },
    {
      id: 'sample-5',
      title: 'Flood Preparedness Workshop Successfully Completed',
      excerpt: 'Over 200 community members attended the recent flood preparedness and response training.',
      content: 'The recent flood preparedness workshop conducted by MDRRMO Pio Duran was a tremendous success.',
      image: 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg',
      author: 'Community Outreach Team',
      status: 'published' as const,
      date: new Date(Date.now() - 259200000).toISOString().split('T')[0],
      created_at: new Date(Date.now() - 259200000).toISOString(),
      updated_at: new Date(Date.now() - 259200000).toISOString()
    }
  ] : publishedNews;
  
  const filteredNews = publishedNews.filter(article => {
    const matchesSearch = 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const recentNews = (filteredNews.length > 0 ? filteredNews : sampleNews).slice(0, 8);
  const featuredNews = (filteredNews.length > 0 ? filteredNews : sampleNews)[0] || null;

  useEffect(() => {
    if (featuredNews && !selectedNews) {
      setSelectedNews(featuredNews);
    }
  }, [featuredNews, selectedNews]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  const getNewsTypeColor = (title: string) => {
    if (title.toLowerCase().includes('alert') || title.toLowerCase().includes('warning')) {
      return 'bg-red-500';
    }
    if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('hotline')) {
      return 'bg-red-500';
    }
    if (title.toLowerCase().includes('training') || title.toLowerCase().includes('workshop')) {
      return 'bg-blue-500';
    }
    return 'bg-yellow-500';
  };

  const getNewsTypeLabel = (title: string) => {
    if (title.toLowerCase().includes('alert') || title.toLowerCase().includes('warning')) {
      return 'Alert';
    }
    if (title.toLowerCase().includes('emergency') || title.toLowerCase().includes('hotline')) {
      return 'Emergency Hotlines!';
    }
    if (title.toLowerCase().includes('training') || title.toLowerCase().includes('workshop')) {
      return 'Training';
    }
    return 'Report and Incident';
  };

  // If no news available, show placeholder
  if (publishedNews.length === 0 && sampleNews.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">News Portal</h1>
            <div className="bg-white rounded-xl shadow-lg p-12">
              <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No News Available</h2>
              <p className="text-gray-600 mb-6">News articles will appear here once published by the admin.</p>
              <Link 
                to="/admin/news"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <User className="mr-2" size={16} />
                Go to Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-blue-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">News Portal</h1>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Stay informed with the latest news, announcements, and emergency updates from MDRRMO Pio Duran
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''} found
              </span>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Filter size={16} className="mr-2" />
                Articles
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex">
        {/* Sidebar */}
        <div className={`w-80 bg-blue-950 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 fixed lg:static z-10 min-h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="p-6 border-b border-blue-900">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Latest Updates</h2>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-blue-200 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto">
            {recentNews.map((article, index) => (
              <div
                key={article.id}
                className={`p-4 border-b border-blue-900 hover:bg-blue-900 cursor-pointer transition-colors ${
                  selectedNews?.id === article.id ? 'bg-blue-800 border-l-4 border-yellow-500' : ''
                }`}
                onClick={() => {
                  setSelectedNews(article);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
              >
                <div className="flex items-start space-x-3">
                  <div className={`${getNewsTypeColor(article.title)} text-white p-2 rounded-lg flex-shrink-0`}>
                    {getNewsTypeLabel(article.title).includes('Emergency') ? (
                      <Phone size={16} />
                    ) : getNewsTypeLabel(article.title).includes('Alert') ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                      {article.title}
                    </h3>
                    <p className="text-blue-200 text-xs">{formatTimeAgo(article.date || article.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* News Detail */}
          <div className="p-6 max-w-6xl mx-auto">
            {selectedNews ? (
              <article className="bg-white rounded-xl shadow-md overflow-hidden">
                {selectedNews.image && (
                  <img 
                    src={selectedNews.image} 
                    alt={selectedNews.title} 
                    className="w-full h-80 object-cover"
                  />
                )}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 ${getNewsTypeColor(selectedNews.title)} text-white rounded-full text-sm font-medium`}>
                      {getNewsTypeLabel(selectedNews.title)}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock size={14} className="mr-1" />
                      {formatTimeAgo(selectedNews.date || selectedNews.created_at)}
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{selectedNews.title}</h1>
                  
                  {selectedNews.author && (
                    <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Users className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedNews.author}</p>
                      <p className="text-gray-500 text-sm">MDRRMO Operations Center</p>
                    </div>
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    {selectedNews.excerpt && <p className="mb-4 text-lg text-gray-600">{selectedNews.excerpt}</p>}
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {selectedNews.content || 'Content not available.'}
                    </div>
                  </div>

                  {/* Social Share */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this article</h3>
                    <SocialShareButtons
                      url={`${window.location.origin}/news/${selectedNews.id}`}
                      title={selectedNews.title}
                      description={selectedNews.excerpt || selectedNews.title}
                      image={selectedNews.image}
                      hashtags={['MDRRMO', 'PioDuran', 'News']}
                    />
                  </div>

                  {/* Tags */}
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Related Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm hover:bg-yellow-200 transition-colors cursor-pointer">#DisasterPreparedness</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors cursor-pointer">#EmergencyResponse</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm hover:bg-green-200 transition-colors cursor-pointer">#PublicSafety</span>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm hover:bg-red-200 transition-colors cursor-pointer">#CommunityAlert</span>
                    </div>
                  </div>
                </div>
              </article>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Eye className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a News Article</h2>
                <p className="text-gray-600 mb-6">Choose an article from the sidebar to read the full content</p>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                >
                  <Filter size={16} className="mr-2" />
                  Browse Articles
                </button>
              </div>
            )}
            
            {/* Related Articles */}
            {selectedNews && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {filteredNews
                    .filter(article => article.id !== selectedNews.id)
                    .slice(0, 3)
                    .map((article) => (
                    <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                         onClick={() => setSelectedNews(article)}>
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                      <div className="p-5">
                        <div className="flex items-center mb-2">
                          <span className={`text-xs font-medium ${getNewsTypeColor(article.title)} text-white px-2 py-1 rounded`}>
                            {getNewsTypeLabel(article.title)}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mt-2 mb-2 line-clamp-2">{article.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt || 'No excerpt available'}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatTimeAgo(article.date || article.created_at)}
                          </span>
                          <ArrowRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredNews.filter(article => article.id !== selectedNews.id).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No other articles available at this time.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsPage;