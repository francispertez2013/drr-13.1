import React, { useState, useEffect } from 'react';
import { FileText, BarChart3, ClipboardList, Search, Download, FolderOpen, Shield, Users, Award, ArrowRight, CheckCircle, Star, TrendingUp, Clock, Eye } from 'lucide-react';
import { usePages } from '../contexts/PagesContext';
import { Link } from 'react-router-dom';
import ResourceDownloadCard from './ResourceDownloadCard';

const Resources: React.FC = () => {
  const { resources } = usePages();
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const publishedResources = resources.filter(resource => resource.status === 'published');
  const featuredResources = publishedResources.filter(resource => resource.featured).slice(0, 3);

  const resourceCategories = [
    {
      icon: Shield,
      title: 'Emergency Guides',
      description: 'Essential safety protocols and emergency response procedures',
      color: 'from-blue-500 to-cyan-600',
      accent: 'blue',
      count: publishedResources.filter(r => r.category === 'guide').length,
      bgPattern: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
    },
    {
      icon: BarChart3,
      title: 'Reports & Analytics',
      description: 'Comprehensive data analysis and incident documentation',
      color: 'from-emerald-500 to-green-600',
      accent: 'emerald',
      count: publishedResources.filter(r => r.category === 'report').length,
      bgPattern: 'radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
    },
    {
      icon: ClipboardList,
      title: 'Forms & Templates',
      description: 'Ready-to-use documents and application forms',
      color: 'from-purple-500 to-violet-600',
      accent: 'purple',
      count: publishedResources.filter(r => r.category === 'form').length,
      bgPattern: 'radial-gradient(circle at 20% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
    },
    {
      icon: FolderOpen,
      title: 'Planning Resources',
      description: 'Strategic planning documents and implementation guides',
      color: 'from-orange-500 to-red-600',
      accent: 'orange',
      count: publishedResources.filter(r => r.category === 'plan').length,
      bgPattern: 'radial-gradient(circle at 80% 80%, rgba(249, 115, 22, 0.1) 0%, transparent 50%)'
    }
  ];

  const resourceStats = [
    { 
      icon: FileText, 
      value: publishedResources.length.toString(), 
      label: 'Total Resources', 
      description: 'Available for download',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      icon: Download, 
      value: publishedResources.reduce((sum, r) => sum + r.download_count, 0).toLocaleString(), 
      label: 'Total Downloads', 
      description: 'Community engagement',
      color: 'from-green-500 to-green-600'
    },
    { 
      icon: Star, 
      value: '98%', 
      label: 'User Satisfaction', 
      description: 'Based on feedback',
      color: 'from-yellow-500 to-yellow-600'
    },
    { 
      icon: Clock, 
      value: '24/7', 
      label: 'Availability', 
      description: 'Always accessible',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const quickAccessItems = [
    { title: 'Emergency Kit Checklist', icon: Shield, downloads: 1234, category: 'guide' },
    { title: 'Family Disaster Plan', icon: Users, downloads: 987, category: 'plan' },
    { title: 'Evacuation Routes Map', icon: FolderOpen, downloads: 756, category: 'map' },
    { title: 'First Aid Manual', icon: FileText, downloads: 654, category: 'guide' }
  ];

  return (
    <section id="resources" className="py-12 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-10 md:mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl md:rounded-3xl mb-4 md:mb-8 shadow-lg md:shadow-2xl">
            <FolderOpen className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-4 md:mb-6">
            Resources & Downloads
          </h2>
          <div className="w-20 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Essential disaster preparedness materials, official documents, and community resources
          </p>
          
          {/* Public Notice */}
          <div className="mt-6 md:mt-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 md:p-6 shadow-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
                <div className="ml-2 md:ml-3">
                  <p className="text-xs md:text-sm text-blue-800">
                    <span className="font-semibold">Public Access Notice:</span> All materials are freely available for public use. 
                    For high-resolution copies for printing or reproduction, please contact our Public Information Unit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resource Statistics */}
        <div className={`mb-10 md:mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '200ms' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {resourceStats.map((stat, index) => (
              <div key={index} className="group relative bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg md:shadow-xl border border-gray-100 hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-1 md:hover:-translate-y-2">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="text-white" size={20} />
                  </div>
                  <div className="text-xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">{stat.value}</div>
                  <div className="text-sm md:text-lg font-semibold text-gray-800 mb-1">{stat.label}</div>
                  <div className="text-xs md:text-sm text-gray-600">{stat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Categories */}
        <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '400ms' }}>
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">Resource Categories</h3>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              Organized collections of essential documents and materials for disaster preparedness
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer overflow-hidden"
                onMouseEnter={() => setActiveCategory(category.title)}
                onMouseLeave={() => setActiveCategory(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: category.bgPattern }}></div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 text-center">
                  <div className={`w-20 h-20 bg-gradient-to-br ${category.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <category.icon className="text-white" size={36} />
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h4>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-center space-x-2 text-sm font-semibold">
                    <span className={`text-${category.accent}-600`}>{category.count}</span>
                    <span className="text-gray-500">Documents</span>
                  </div>
                </div>
                
                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        {featuredResources.length > 0 && (
          <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '600ms' }}>
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">Featured Resources</h3>
              <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 mx-auto rounded-full mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto text-lg">
                Most important and frequently accessed resources for emergency preparedness
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredResources.map((resource, index) => (
                <div key={resource.id} className="group relative" style={{ animationDelay: `${index * 150}ms` }}>
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <FileText className="text-white" size={28} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="text-yellow-500 fill-current" size={16} />
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {resource.title}
                    </h4>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Download size={14} className="mr-1" />
                          <span>{resource.download_count}</span>
                        </div>
                        <span className="uppercase font-medium">{resource.file_type}</span>
                      </div>
                      
                      <button
                        onClick={() => window.open(resource.file_url, '_blank')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors group/btn"
                      >
                        <Download className="mr-2 group-hover/btn:animate-bounce" size={16} />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Access Section */}
        <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '700ms' }}>
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Quick Access Resources</h3>
                  <p className="text-blue-100">Most downloaded emergency preparedness materials</p>
                </div>
                <div className="hidden md:block">
                  <TrendingUp className="text-white/60" size={48} />
                </div>
              </div>
            </div>
            
            <div className="p-8">
              {publishedResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {publishedResources
                    .sort((a, b) => b.download_count - a.download_count)
                    .slice(0, 4)
                    .map((resource, index) => (
                    <div key={resource.id} className="group flex items-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <FileText className="text-white" size={20} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {resource.title}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {resource.category}
                          </span>
                          <div className="flex items-center text-xs text-gray-500">
                            <Download size={12} className="mr-1" />
                            <span>{resource.download_count} downloads</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(resource.file_url, '_blank')}
                        className="text-blue-600 hover:text-blue-800 transition-colors group-hover:scale-110 transform duration-300"
                      >
                        <Download size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No Resources Available</h4>
                  <p className="text-gray-600 mb-6">Resources will appear here once uploaded by administrators.</p>
                  <Link
                    to="/admin/resources"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    <Users className="mr-2" size={16} />
                    Access Admin Panel
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How to Access Section */}
        <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-gray-900 mb-6">
                How to Access Resources
              </h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">
                Our resource library is designed for easy access and maximum usability. 
                Follow these simple steps to find and download the materials you need.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: 'Browse Categories', description: 'Explore organized collections by type and purpose' },
                  { step: 2, title: 'Search & Filter', description: 'Use our advanced search to find specific resources' },
                  { step: 3, title: 'Download Instantly', description: 'Click to download - no registration required' },
                  { step: 4, title: 'Share & Use', description: 'Distribute materials freely within your community' }
                ].map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 shadow-2xl">
                <div className="text-center text-white">
                  <Search className="mx-auto h-16 w-16 mb-6 animate-pulse" />
                  <h4 className="text-2xl font-bold mb-4">Resource Library</h4>
                  <p className="text-blue-100 mb-6">
                    Access our comprehensive collection of disaster management resources
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="font-bold text-lg">{publishedResources.length}</div>
                      <div className="text-blue-200">Documents</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                      <div className="font-bold text-lg">{resourceCategories.length}</div>
                      <div className="text-blue-200">Categories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '900ms' }}>
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-12 shadow-2xl relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.3) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`
              }}></div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-6">Explore Our Complete Resource Library</h3>
              <p className="text-white/90 mb-8 max-w-3xl mx-auto text-lg">
                Access hundreds of documents, guides, and tools designed to help you prepare for and respond to emergencies.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/resources"
                  className="group inline-flex items-center px-10 py-4 bg-white text-blue-600 rounded-2xl hover:bg-gray-100 transition-all duration-300 font-bold shadow-xl hover:shadow-2xl transform hover:scale-105"
                >
                  <FolderOpen className="mr-3 group-hover:animate-bounce" size={24} />
                  Browse All Resources
                  <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <Link 
                  to="/contact"
                  className="group inline-flex items-center px-10 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl hover:bg-white/30 transition-all duration-300 font-bold border border-white/30 hover:border-white/50 transform hover:scale-105"
                >
                  <Users className="mr-3 group-hover:animate-bounce" size={24} />
                  Request Custom Resources
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;