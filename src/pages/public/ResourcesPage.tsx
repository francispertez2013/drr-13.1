import React, { useState } from 'react';
import { FileText, Download, Search, BarChart3, ClipboardList, MapPin, Shield, Users, Award, FolderOpen } from 'lucide-react';
import { usePages } from '../../contexts/PagesContext';
import ResourceDownloadCard from '../../components/ResourceDownloadCard';
import { Link } from 'react-router-dom';

const ResourcesPage: React.FC = () => {
  const { resources } = usePages();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const publishedResources = resources.filter(resource => resource.status === 'published');
  const featuredResources = publishedResources.filter(resource => resource.featured);

  const filteredResources = publishedResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const resourceCategories = [
    {
      id: 'guides',
      name: 'Preparedness Guides',
      description: 'Essential safety information and planning templates',
      icon: Shield,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      count: publishedResources.filter(r => r.category === 'guide').length
    },
    {
      id: 'plans',
      name: 'Plans & Reports',
      description: 'Official strategic documents and annual reports',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      count: publishedResources.filter(r => r.category === 'plan' || r.category === 'report').length
    },
    {
      id: 'forms',
      name: 'Forms',
      description: 'Downloadable forms for various purposes',
      icon: ClipboardList,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      count: publishedResources.filter(r => r.category === 'form').length
    },
    {
      id: 'maps',
      name: 'Maps',
      description: 'Detailed hazard and evacuation maps',
      icon: MapPin,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      count: publishedResources.filter(r => r.category === 'map').length
    }
  ];

  const categories = ['all', 'guide', 'form', 'map', 'report', 'plan', 'manual'];

  const resourceStats = [
    { value: publishedResources.length.toString(), label: 'Total Resources', description: 'Documents and maps available' },
    { value: publishedResources.reduce((sum, r) => sum + r.download_count, 0).toLocaleString(), label: 'Total Downloads', description: 'Resources downloaded' },
    { value: '95%', label: 'User Satisfaction', description: 'Based on feedback surveys' },
    { value: '24/7', label: 'Access Availability', description: 'Resources available anytime' }
  ];

  // If no resources available, show admin link
  if (publishedResources.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-900 mb-8">Resources & Downloads</h1>
            <div className="bg-white rounded-xl shadow-lg p-12">
              <FolderOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Resources Available</h2>
              <p className="text-gray-600 mb-6">Resources will appear here once uploaded by the admin.</p>
              <Link 
                to="/admin/resources"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Users className="mr-2" size={16} />
                Go to Admin Panel
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 pt-20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-20 right-10 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-2"></div>
          <div className="absolute -bottom-10 left-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-4"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8 animate-pulse-glow">
              <FolderOpen className="text-blue-950" size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-text-glow">Resources & Downloads</h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Essential documents, forms, and maps to help residents prepare for and respond to various hazards
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6">
        <div className="py-16">
          {/* Notice */}
          <div className="glass-modern border border-blue-200 rounded-2xl p-6 mb-16 shadow-modern-lg">
            <p className="text-blue-800 text-center text-lg leading-relaxed">
              <strong>Note:</strong> All information materials here are for public consumption. 
              Request for high-resolution copies for printing and/or reproduction can be requested through the Public Information Unit.
            </p>
          </div>

          {/* Resource Categories */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Resource Categories</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-pink-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              Browse our comprehensive collection of disaster management resources organized by category
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resourceCategories.map((category) => (
              <button 
                key={category.id} 
                onClick={() => setSelectedCategory(category.id === 'guides' ? 'guide' : category.id)}
                className={`card-modern interactive-card shadow-modern-lg hover:shadow-modern-xl text-center group cursor-pointer w-full p-8 stagger-${resourceCategories.indexOf(category) + 1}`}
              >
                <div className={`w-20 h-20 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <category.icon className={`${category.color}`} size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-800 transition-colors">{category.description}</p>
                <span className={`${category.color} font-bold text-lg`}>{category.count} Documents</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
              
              <div className="text-sm text-gray-600 flex items-center">
                {filteredResources.length} resource{filteredResources.length !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </div>

          {/* Featured Resources */}
          {featuredResources.length > 0 && (
            <div className="mb-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Resources</h2>
              <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Most important and frequently accessed resources
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredResources.map((resource) => (
                <ResourceDownloadCard key={resource.id} resource={resource} />
              ))}
            </div>
            </div>
          )}

          {/* All Resources */}
          <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">All Resources ({filteredResources.length})</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {selectedCategory === 'all' 
                ? 'Browse all available resources and documents'
                : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} resources`
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredResources.map((resource) => (
              <ResourceDownloadCard key={resource.id} resource={resource} />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
          </div>

          {/* Resource Statistics */}
          <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Resource Statistics</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Overview of our resource collection and usage metrics
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {resourceStats.map((stat, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-8 shadow-lg">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{stat.value}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{stat.label}</h3>
                <p className="text-gray-600">{stat.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>
 );
};

export default ResourcesPage;