import React, { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Camera, Play } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import LazyImage from './LazyImage';

const ImageGallery: React.FC = () => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const { gallery } = useData();
  const publishedGallery = gallery.filter(item => item.status === 'published');

  // Use gallery images if available, otherwise fallback to default images
  const images = publishedGallery.length > 0 
    ? publishedGallery.map(item => ({ 
        url: item.image || 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
        title: item.title,
        description: item.description
      }))
    : [
        { url: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575265/487673077_1062718335885316_7552782387266701410_n_gexfn2.jpg', title: 'BDRRM Training Workshop', description: 'Barangay officials training' },
        { url: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575261/489043126_1065374988952984_1331524645056736117_n_fbmvch.jpg', title: 'Earthquake Drill', description: 'Community preparedness exercise' },
        { url: 'https://res.cloudinary.com/dedcmctqk/image/upload/v1750575263/472984055_1002760098547807_5747993743270536498_n_cgi07u.jpg', title: 'Water Rescue Training', description: 'WASAR training session' },
        { url: 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg', title: 'Fire Safety Campaign', description: 'Community fire prevention' },
        { url: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg', title: 'Emergency Response', description: 'Community training' },
        { url: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg', title: 'Flood Response', description: 'Emergency simulation' }
      ];

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    let scrollInterval: NodeJS.Timeout;

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (gallery.scrollLeft >= gallery.scrollWidth - gallery.clientWidth) {
          gallery.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          gallery.scrollBy({ left: 1, behavior: 'smooth' });
        }
      }, 30);
    };

    const stopAutoScroll = () => {
      clearInterval(scrollInterval);
    };

    startAutoScroll();

    gallery.addEventListener('mouseenter', stopAutoScroll);
    gallery.addEventListener('mouseleave', startAutoScroll);

    return () => {
      clearInterval(scrollInterval);
      gallery.removeEventListener('mouseenter', stopAutoScroll);
      gallery.removeEventListener('mouseleave', startAutoScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    const scrollAmount = 300;
    gallery.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
        <section className="py-12 md:py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-5 w-48 md:w-96 h-48 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-5 w-48 md:w-96 h-48 md:h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-4 left-10 w-48 md:w-96 h-48 md:h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-yellow-500 mb-4 md:mb-6 relative">
            <span className="relative z-10">Our Activities & Events</span>
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed px-4">
            Capturing moments from our disaster preparedness activities and community engagement events
          </p>
        </div>
        
        {/* Horizontal Scrolling Gallery */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center z-10">
            <button
              onClick={() => scroll('left')}
              className="bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg md:shadow-xl ml-2 md:ml-4 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            >
              <ChevronLeft className="text-blue-950" size={18} />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center z-10">
            <button
              onClick={() => scroll('right')}
              className="bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg md:shadow-xl mr-2 md:mr-4 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            >
              <ChevronRight className="text-blue-950" size={18} />
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 py-3 md:py-6 overflow-hidden shadow-lg md:shadow-2xl">
            <div
              ref={galleryRef}
              className="flex space-x-3 md:space-x-6 px-3 md:px-6 overflow-x-auto scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-48 h-48 md:w-72 md:h-72 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 transform hover:scale-105 relative group border border-white/20"
                >
                  <LazyImage
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full"
                    width={192}
                    height={192}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end">
                    <div className="p-3 md:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="font-bold text-sm md:text-lg mb-1 md:mb-2">{image.title}</h4>
                      <p className="text-xs md:text-sm opacity-90 leading-relaxed">{image.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 md:mt-16">
          <Link
            to="/gallery"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-950 rounded-full hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 font-bold shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transform hover:scale-105 mr-2 md:mr-4 mb-2 md:mb-0 text-sm md:text-base"
          >
            <Camera className="mr-2 md:mr-3" size={16} />
            View Full Gallery
          </Link>
          <Link
            to="/video-gallery"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-400 hover:to-red-500 transition-all duration-300 font-bold shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transform hover:scale-105 text-sm md:text-base"
          >
            <Play className="mr-2 md:mr-3" size={16} />
            Watch Videos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ImageGallery;