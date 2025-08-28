import React from 'react';
import { useData } from '../../contexts/DataContext';

const Services: React.FC = () => {
  const { services } = useData();
  const activeServices = services.filter(service => service.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center text-blue-900 mb-8">Our Services</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Comprehensive disaster risk reduction and management services for the Pio Duran community
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-blue-600"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <span className="text-blue-600 text-2xl">🛡️</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3 text-blue-900">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;