import React, { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import ResourceManager from './ResourceManager';
import { usePages } from '../contexts/PagesContext';

const ResourcesPage: React.FC = () => {
  const { resources } = usePages();

  const publishedResources = resources.filter(resource => resource.status === 'published');

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
        <ResourceManager resources={publishedResources} />
      </div>
    </div>
  );
};

export default ResourcesPage;