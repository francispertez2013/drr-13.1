import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Loader,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'youtube';
  content: string;
  image?: string;
  video?: string;
  link?: string;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  author: {
    name: string;
    avatar?: string;
  };
}

interface SocialMediaFeedProps {
  maxPosts?: number;
  platforms?: string[];
  showEngagement?: boolean;
}

const SocialMediaFeed: React.FC<SocialMediaFeedProps> = ({
  maxPosts = 6,
  platforms = ['facebook', 'twitter', 'instagram', 'youtube'],
  showEngagement = true
}) => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set()); // <-- Fixed

  useEffect(() => {
    fetchSocialPosts();
    // eslint-disable-next-line
  }, []);

  const fetchSocialPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('social_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(maxPosts);

      if (error && !error.message.includes('relation "social_posts" does not exist')) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const transformedPosts = data.map(post => ({
          id: post.id,
          platform: post.platform,
          content: post.content,
          image: post.image,
          link: post.link,
          timestamp: post.created_at,
          engagement: post.engagement || { likes: 0, comments: 0, shares: 0 },
          author: { name: 'MDRRMO Pio Duran' }
        }));
        setPosts(transformedPosts);
      } else {
        // Fallback to mock data if no posts in database
        setPosts(mockPosts);
      }
    } catch (error) {
      console.error('Error fetching social posts:', error);
      // Fallback to mock data on error
      setPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  // Mock social media posts - In real app, these would come from APIs
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'facebook',
      content: '🎯 BDRRM Planning Training Workshop completed successfully! Thank you to all barangay officials who participated in strengthening our disaster preparedness. Together, we build a more resilient Pio Duran! 💪 #MDRRMO #DisasterPreparedness #PioDuran',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg',
      timestamp: '2024-06-29T10:30:00Z',
      engagement: { likes: 45, comments: 8, shares: 12 },
      author: { name: 'MDRRMO Pio Duran', avatar: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750079276/logome_h9snnx.webp' }
    },
    {
      id: '2',
      platform: 'twitter',
      content: '🚨 Nationwide Earthquake Drill: Over 5,000 participants joined our community preparedness exercise! Great job everyone! 🏢 #DisasterPreparedness #PioDuran #EarthquakeDrill #CommunityResilience',
      timestamp: '2023-06-09T14:15:00Z',
      engagement: { likes: 23, comments: 5, shares: 18 },
      author: { name: 'MDRRMO Pio Duran' }
    },
    {
      id: '3',
      platform: 'instagram',
      content: '🌊 Water rescue training in action! Our dedicated volunteers are ready to serve and protect our community. Swipe to see more from today\'s intensive WASAR training session.',
      image: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg',
      timestamp: '2023-05-24T16:45:00Z',
      engagement: { likes: 67, comments: 12, shares: 8 },
      author: { name: 'MDRRMO Pio Duran' }
    },
    {
      id: '4',
      platform: 'youtube',
      content: 'Emergency Response Training: Complete Guide for Community Volunteers',
      video: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
      timestamp: '2024-03-15T09:00:00Z',
      engagement: { likes: 89, comments: 15, shares: 25 },
      author: { name: 'MDRRMO Pio Duran' }
    },
    {
      id: '5',
      platform: 'facebook',
      content: '🔥 Fire Safety Awareness Campaign was a huge success! Thank you to all families and businesses who participated. Remember: Prevention is always better than cure. Stay safe, Pio Duran! 🏠',
      image: 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg',
      timestamp: '2023-12-10T11:20:00Z',
      engagement: { likes: 34, comments: 6, shares: 9 },
      author: { name: 'MDRRMO Pio Duran' }
    },
    {
      id: '6',
      platform: 'twitter',
      content: '⚠️ Weather Update: Monitoring tropical depression approaching our area. Stay tuned for updates and follow safety protocols. #WeatherAlert #StaySafe #PioDuran',
      timestamp: '2024-01-20T08:30:00Z',
      engagement: { likes: 56, comments: 12, shares: 34 },
      author: { name: 'MDRRMO Pio Duran' }
    }
  ];

  const platformConfig = {
    facebook: { icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50' },
    twitter: { icon: Twitter, color: 'text-sky-500', bg: 'bg-sky-50' },
    instagram: { icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50' },
    youtube: { icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' }
  };

  const filteredPosts = posts
    .filter(post => selectedPlatform === 'all' || post.platform === selectedPlatform)
    .filter(post => platforms.includes(post.platform))
    .slice(0, maxPosts);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  // Helper for truncating text
  const truncateText = (text: string, length = 150) => {
    return text.length > length ? text.slice(0, length) + '...' : text;
  };

  // Toggle expanded state for a post
  const toggleExpanded = (postId: string) => {
    setExpandedPosts(prev => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
      } else {
        next.add(postId);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Loading social media posts...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Latest Updates</h3>
          <div className="flex items-center space-x-2">
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="twitter">Twitter</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="divide-y divide-gray-200">
        {filteredPosts.map((post) => {
          const config = platformConfig[post.platform];
          const PlatformIcon = config.icon;

          return (
            <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
              {/* Post Header */}
              <div className="flex items-start space-x-3 mb-3">
                <div className={`${config.bg} p-2 rounded-lg`}>
                  <PlatformIcon size={20} className={config.color} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{post.author.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar size={12} />
                        <span>{formatTimestamp(post.timestamp)}</span>
                        <span className="capitalize">{post.platform}</span>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <div className="text-gray-700 mb-3">
                  {expandedPosts.has(post.id) ? (
                    <p>{post.content}</p>
                  ) : (
                    <p>{truncateText(post.content)}</p>
                  )}
                  {post.content.length > 150 && (
                    <button
                      onClick={() => toggleExpanded(post.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2 flex items-center"
                    >
                      {expandedPosts.has(post.id) ? (
                        <>
                          <ChevronUp size={14} className="mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} className="mr-1" />
                          Show more
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Media */}
                {post.image && (
                  <img
                    src={post.image}
                    alt="Post content"
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                )}
                
                {post.video && (
                  <div className="relative">
                    <img
                      src={post.video}
                      alt="Video thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <Youtube className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Engagement */}
              {showEngagement && (
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart size={14} />
                      <span>{formatNumber(post.engagement.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle size={14} />
                      <span>{formatNumber(post.engagement.comments)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 size={14} />
                      <span>{formatNumber(post.engagement.shares)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-500 hover:text-red-500 transition-colors">
                      <Heart size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle size={16} />
                    </button>
                    <button className="text-gray-500 hover:text-green-500 transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 text-center">
        <button className="text-blue-600 hover:text-blue-800 font-medium">
          View More Posts
        </button>
      </div>
    </div>
  );
};

export default SocialMediaFeed;