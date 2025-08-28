import React from 'react';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';
import SocialShareButtons from './SocialShareButtons';
import SocialMediaFeed from './SocialMediaFeed';

const sampleNews = [
  // Add your sample news objects here if needed
];

const News: React.FC = () => {
  const { news } = useData();
  const publishedNews = news.filter(article => article.status === 'published');

  // Prepare secondary news to always display 4 items
  const sourceNews = publishedNews.length > 0 ? publishedNews : sampleNews;
  const secondaryNews = sourceNews.slice(1, 5);
  // If fewer than 4 news, fill with placeholders
  while (secondaryNews.length < 4) {
    secondaryNews.push({
      id: `placeholder-${secondaryNews.length}`,
      title: "No News Available",
      excerpt: "",
      image: "",
      date: "",
      created_at: "",
    });
  }

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
            <span className="relative z-10">News & Updates</span>
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-32 h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
            Stay informed with the latest news, announcements, and events from the Municipality of Pio Duran.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-12 mb-8 md:mb-16">
          {/* Main News Content */}
          <div className="lg:col-span-2">
            {sourceNews.length > 0 ? (
              <div className="space-y-8">
                {/* Featured News */}
                {sourceNews[0] && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl overflow-hidden border border-white/20 hover:border-yellow-500/50 transition-all duration-500 group">
                    <div className="relative">
                      {sourceNews[0].image && (
                        <div className="h-48 md:h-80 overflow-hidden">
                          <img
                            src={sourceNews[0].image}
                            alt={sourceNews[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg';
                            }}
                          />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-yellow-500 text-blue-950 px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold shadow-lg">
                          Featured
                        </span>
                      </div>
                    </div>
                    <div className="p-4 md:p-8">
                      <div className="flex items-center text-yellow-400 font-semibold mb-3 md:mb-4">
                        <Calendar size={16} className="mr-2 md:mr-3" />
                        {new Date(sourceNews[0].date || sourceNews[0].created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <h3 className="text-lg md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4 leading-tight">
                        {sourceNews[0].title}
                      </h3>
                      <p className="text-sm md:text-base lg:text-lg text-blue-100 mb-4 md:mb-6 leading-relaxed">
                        {sourceNews[0].excerpt || 'No excerpt available'}
                      </p>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
                        <SocialShareButtons
                          url={`${window.location.origin}/news-portal`}
                          title={sourceNews[0].title}
                          description={sourceNews[0].excerpt || sourceNews[0].title}
                          image={sourceNews[0].image}
                          size="sm"
                          showLabels={false}
                          hashtags={['MDRRMO', 'PioDuran', 'News']}
                        />
                        
                        <Link 
                          to="/news-portal"
                          className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-blue-950 rounded-full font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg text-sm md:text-base"
                        >
                          Read Full Story
                          <ArrowRight size={16} className="ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Secondary News - Always show 4 cards */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {secondaryNews.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white/10 backdrop-blur-sm rounded-lg md:rounded-xl shadow-md md:shadow-lg overflow-hidden border border-white/20 hover:border-yellow-500/50 transition-all duration-300 transform hover:-translate-y-1 md:hover:-translate-y-2 group"
                    >
                      {item.image ? (
                        <div className="h-32 md:h-48 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="h-32 md:h-48 bg-slate-800 flex items-center justify-center text-blue-300 text-xs md:text-sm">
                          No Image Available
                        </div>
                      )}
                      <div className="p-4 md:p-6">
                        <div className="flex items-center text-yellow-400 font-medium mb-2 md:mb-3 text-xs md:text-sm">
                          <Calendar size={12} className="mr-1 md:mr-2" />
                          {item.date || item.created_at ? new Date(item.date || item.created_at).toLocaleDateString() : 'No date'}
                        </div>
                        <h3 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-3 line-clamp-2 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-blue-100 mb-3 md:mb-4 line-clamp-2 text-xs md:text-sm">
                          {item.excerpt || 'No excerpt available'}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <SocialShareButtons
                            url={`${window.location.origin}/news-portal`}
                            title={item.title}
                            description={item.excerpt || item.title}
                            image={item.image}
                            size="sm"
                            showLabels={false}
                            hashtags={['MDRRMO', 'PioDuran', 'News']}
                          />
                          
                          <Link 
                            to="/news-portal"
                            className="text-yellow-400 font-semibold hover:text-yellow-300 flex items-center transition-colors text-xs md:text-sm"
                          >
                            Read More
                            <ArrowRight size={12} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg p-6 md:p-12 text-center border border-white/20">
                <Newspaper className="mx-auto h-12 md:h-20 w-12 md:w-20 text-yellow-400 mb-4 md:mb-6" />
                <h3 className="text-lg md:text-2xl font-bold text-white mb-3 md:mb-4">No News Available</h3>
                <p className="text-sm md:text-base lg:text-lg text-blue-100 mb-6 md:mb-8">News articles will appear here once published by the admin.</p>
                <Link 
                  to="/admin/news"
                  className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-yellow-500 text-blue-950 rounded-full font-bold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 text-sm md:text-base"
                >
                  <Newspaper className="mr-2" size={16} />
                  Manage News
                </Link>
              </div>
            )}
          </div>

          {/* Social Media Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Social Media Feed */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-blue-950 mb-2">Stay Connected</h3>
                  <p className="text-blue-900 text-xs md:text-sm">Follow our latest updates</p>
                </div>
                <div className="p-4 md:p-1">
                  <SocialMediaFeed maxPosts={4} showEngagement={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* View All Button */}
        <div className="text-center mt-8 md:mt-16">
          <Link 
            to="/news-portal"
            className="inline-flex items-center px-6 md:px-10 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-950 font-bold rounded-full shadow-xl md:shadow-2xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl md:hover:shadow-3xl active:scale-95 text-sm md:text-base"
          >
            <Newspaper className="mr-2 md:mr-3" size={18} />
            View All News & Updates
          </Link>
        </div>
      </div>
    </section>
  );
};

export default News;