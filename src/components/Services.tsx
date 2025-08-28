import React from 'react';
import { Shield, Heart, Truck, Home, FolderOpen, AlertTriangle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { services } = useData();
  const [isVisible, setIsVisible] = React.useState(false);
  const activeServices = services.filter(service => service.status === 'active');

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const defaultServices = [
    {
      icon: Shield,
      title: 'Disaster Prevention & Mitigation',
      description: 'Immediate response to disaster-related emergencies with our trained response teams.',
      tags: ['Search & Rescue', 'Medical Assistance', 'Fire Response'],
      color: 'border-green-500',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      icon: Heart,
      title: 'Disaster Preparedness',
      description: 'Regular training programs for community members, volunteers, and responders.',
      tags: ['First Aid Training', 'DRRM Workshops', 'Drills'],
      color: 'border-blue-500',
      bgColor: 'bg-blue-100',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Truck,
      title: 'Disaster Response',
      description: 'Comprehensive hazard, vulnerability, and capacity assessments for communities.',
      tags: ['Flood Mapping', 'Risk Analysis', 'Mitigation Plans'],
      color: 'border-red-500',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      icon: Home,
      title: 'Disaster Recovery & Rehabilitation',
      description: 'Engagement initiatives to build disaster-resilient communities.',
      tags: ['Barangay DRRM', 'School Programs', 'Volunteer Network'],
      color: 'border-yellow-500',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-blue-600'
    }
  ];

  return (
    <section id="services" className="py-12 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
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
        <div className={`text-center mb-3 md:mb-7 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl md:rounded-3xl mb-4 md:mb-4 shadow-lg md:shadow-2xl">
            <AlertTriangle className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-4 md:mb-6">
            Services
          </h2>
          <div className="w-20 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full mb-4 md:mb-5"></div>
          <p className="text-sm md:text-lg lg:text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed px-4">
            Comprehensive step-by-step procedures for before, during, and after emergency situations
          </p>
        </div>


  {/* Dynamic Services from Admin */}
        {activeServices.length > 0 && (
          <div className="mb-16">

            <div className="grid md:grid-cols-2 gap-6 md:gap-5 mb-4 md:mb-6">
              {activeServices.slice(0, 4).map((service) => (
                <div
                  key={service.id}
                  className="flex bg-white p-4 md:p-6 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-3 border border-blue-600 hover:border-yellow-500 group"
                >
                  <div className="mr-3 md:mr-5 self-start">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                      <service.icon className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-blue-950">
                      {service.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="bg-blue-50 text-blue-700 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-16">
          {defaultServices.map((service, index) => (
            <div
              key={index}
              className={`flex bg-white p-4 md:p-8 rounded-xl md:rounded-2xl shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-3 border border-gray-200 hover:border-blue-300 group`}
            >
              <div className="mr-3 md:mr-5 self-start">
                <div className={`bg-gradient-to-br ${service.color.replace('border-', 'from-').replace('-500', '-500')} to-${service.color.replace('border-', '').replace('-500', '-600')} p-3 md:p-4 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="text-white" size={20} />
                </div>
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold mb-2 md:mb-4 text-blue-950">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-700 mb-4 md:mb-6 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-50 text-blue-700 text-xs md:text-sm px-2 md:px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-100 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/services-detail"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl mr-2 md:mr-4 mb-2 md:mb-0"
          >
            <Shield className="mr-2 md:mr-3" size={16} />
            <span className="text-sm md:text-base">View All Services</span>
          </Link>
          <Link 
            to="/resources"
            className="inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-blue-950 rounded-full font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg md:shadow-xl hover:shadow-xl md:hover:shadow-2xl"
          >
            <FolderOpen className="mr-2 md:mr-3" size={16} />
            <span className="text-sm md:text-base">Browse Resources</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;