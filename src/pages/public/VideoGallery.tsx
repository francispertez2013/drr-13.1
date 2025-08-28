import React, { useState, useEffect } from 'react';
import { Video, Search, Filter, Calendar, MapPin, Tag, Eye, Play, BookOpen, X, Download, Clock } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/SEOHead';

interface VideoAlbum {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  coverImage: string;
  videos: string[];
}

interface VideoItem {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail: string;
  category?: string;
  date?: string;
  location?: string;
  duration?: string;
  tags?: string[];
  status: 'published' | 'draft';
  featured: boolean;
  created_at: string;
  updated_at: string;
}

const VideoGallery: React.FC = () => {
  const { videos } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<string | null>(null);
  const [albums, setAlbums] = useState<VideoAlbum[]>([]);


  const publishedVideos = videos.filter(video => video.status === 'published');

  // Create albums from video categories
  useEffect(() => {
    const categories = [...new Set(publishedVideos.map(video => video.category).filter(Boolean))];
    const generatedAlbums: VideoAlbum[] = categories.map((category) => {
      const categoryVideos = publishedVideos.filter(video => video.category === category);
      return {
        id: category,
        name: `${category} Videos`,
        description: `${categoryVideos.length} videos from ${category.toLowerCase()} activities`,
        icon: getIconForCategory(category),
        count: categoryVideos.length,
        coverImage: categoryVideos[0]?.thumbnail || 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
        videos: categoryVideos.map(video => video.id)
      };
    });
    setAlbums(generatedAlbums);
  }, [publishedVideos]);

  const getIconForCategory = (category: string): string => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('training')) return 'graduation-cap';
    if (categoryLower.includes('drill')) return 'shield';
    if (categoryLower.includes('campaign')) return 'megaphone';
    if (categoryLower.includes('response')) return 'truck';
    return 'video';
  };

  const filteredVideos = publishedVideos.filter(video => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (video.location && video.location.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || video.category === categoryFilter;
    const matchesAlbum = selectedAlbum === null || video.category === selectedAlbum;
    
    return matchesSearch && matchesCategory && matchesAlbum;
  });

  const selectAlbum = (albumId: string | null) => {
    setSelectedAlbum(albumId);
    setCategoryFilter(albumId || 'all');
  };

  const openModal = (video: VideoItem) => {
    setSelectedVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  const downloadVideo = () => {
    if (!selectedVideo) return;
    
    const a = document.createElement('a');
    a.href = selectedVideo.video_url;
    a.download = `${selectedVideo.title.replace(/\s+/g, '_')}.mp4`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If no videos available, show placeholder
  if (publishedVideos.length === 0) {
    return (
      <>
        <SEOHead
          title="Video Gallery - MDRRMO Pio Duran"
          description="Watch videos from MDRRMO training sessions, drills, and community activities in Pio Duran, Albay."
        />
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-900 mb-8">Video Gallery</h1>
              <div className="bg-white rounded-xl shadow-lg p-12">
                <Video className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Videos Available</h2>
                <p className="text-gray-600 mb-6">Videos will appear here once uploaded by the admin.</p>
                <Link 
                  to="/admin/videos"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Video className="mr-2" size={16} />
                  Go to Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title="Video Gallery - MDRRMO Pio Duran"
        description="Watch videos from MDRRMO training sessions, drills, and community activities in Pio Duran, Albay."
        keywords="MDRRMO videos, Pio Duran training, disaster management videos, emergency drills, community activities"
      />
      
      <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 min-h-screen flex relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-2xl animate-float"></div>
          <div className="absolute top-20 right-20 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl animate-float stagger-2"></div>
          <div className="absolute bottom-10 left-1/2 w-36 h-36 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl animate-float stagger-4"></div>
        </div>
        
        {/* Video Albums Sidebar */}
        <div className="w-80 glass-dark shadow-2xl border-r border-yellow-500/30 overflow-y-auto relative z-10">
          <div className="p-6 border-b border-yellow-500/30">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-yellow-500 animate-pulse" />
              <h2 className="text-2xl font-bold text-yellow-500 animate-text-glow">Video Albums</h2>
            </div>
            <p className="text-yellow-200">Browse your video collections</p>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              {/* All Videos Album */}
              <div
                onClick={() => selectAlbum(null)}
                className={`glass-dark rounded-2xl p-6 cursor-pointer border transition-all duration-300 hover:transform hover:translate-x-2 hover:shadow-xl ${
                  selectedAlbum === null 
                    ? 'border-yellow-500 bg-yellow-500/20 shadow-lg' 
                    : 'border-yellow-500/20 hover:border-yellow-500/50 hover:bg-yellow-500/10'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                    <Play className="w-8 h-8 text-blue-950 hover:animate-bounce" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-yellow-500 mb-1 text-lg">All Videos</h3>
                    <p className="text-yellow-200">{publishedVideos.length} videos</p>
                  </div>
                </div>
                <p className="text-yellow-300">Complete collection</p>
              </div>

              {/* Individual Albums */}
              {albums.map((album) => (
                <div
                  key={album.id}
                  onClick={() => selectAlbum(album.id)}
                  className={`bg-blue-900 rounded-xl p-4 cursor-pointer border transition-all duration-200 hover:transform hover:translate-x-1 ${
                    selectedAlbum === album.id 
                      ? 'border-yellow-500 bg-yellow-500/10' 
                      : 'border-yellow-500/20 hover:border-yellow-500/40 hover:bg-yellow-500/5'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden">
                      <img 
                        src={album.coverImage} 
                        alt={album.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-yellow-500 mb-1">{album.name}</h3>
                      <p className="text-sm text-yellow-200">{album.count} videos</p>
                    </div>
                  </div>
                  <p className="text-xs text-yellow-300">{album.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main Gallery */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-yellow-500 mb-2">
                {selectedAlbum ? albums.find(a => a.id === selectedAlbum)?.name : 'DRRM Captured Events'}
              </h1>
              <p className="text-yellow-200">
                {selectedAlbum 
                  ? albums.find(a => a.id === selectedAlbum)?.description 
                  : 'A curated collection of events & activities'
                }
              </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-300" size={20} />
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="all" className="text-gray-900">All Categories</option>
                {[...new Set(publishedVideos.map(video => video.category).filter(Boolean))].map((category) => (
                  <option key={category} value={category} className="text-gray-900">{category}</option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => openModal(video)}
                  className="bg-blue-900 rounded-xl shadow-lg overflow-hidden border border-yellow-500/20 cursor-pointer transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl relative"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-yellow-500/90 rounded-full w-16 h-16 flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-950" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">
                        {video.duration}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-yellow-500 mb-1 line-clamp-1">{video.title}</h3>
                    <p className="text-sm text-yellow-200">
                      {video.category} • {video.date ? new Date(video.date).toLocaleDateString() : 'No date'}
                    </p>
                    {video.location && (
                      <p className="text-xs text-yellow-300 mt-1 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {video.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No videos found</h3>
                <p className="text-yellow-200">Try adjusting your search or filter criteria</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('all');
                    setSelectedAlbum(null);
                  }}
                  className="text-yellow-500 hover:text-yellow-400 font-medium mt-2"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          style={{ animation: 'fadeIn 0.3s ease' }}
        >
          <div className="relative max-w-7xl max-h-full w-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-yellow-500 text-2xl font-bold z-10 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            
            <video
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              controls
              autoPlay
              src={selectedVideo.video_url}
            >
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute bottom-4 right-4 flex gap-3">
              <button
                onClick={downloadVideo}
                className="bg-yellow-500 hover:bg-yellow-600 text-blue-950 px-6 py-3 rounded-full font-medium shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-110"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              <span className="font-medium">{selectedVideo.title}</span>
            </div>

            {/* Video Details */}
            <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              <div className="flex items-center space-x-2 text-sm">
                <Calendar size={14} />
                <span>{selectedVideo.date ? new Date(selectedVideo.date).toLocaleDateString() : 'No date'}</span>
                {selectedVideo.location && (
                  <>
                    <span>•</span>
                    <MapPin size={14} />
                    <span>{selectedVideo.location}</span>
                  </>
                )}
                {selectedVideo.duration && (
                  <>
                    <span>•</span>
                    <Clock size={14} />
                    <span>{selectedVideo.duration}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default VideoGallery;