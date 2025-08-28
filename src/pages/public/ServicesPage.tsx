import React from 'react';
import { Shield, Heart, Truck, Home, CheckCircle, Users, Phone, Clock, MapPin, AlertTriangle, Building } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { Link } from 'react-router-dom';

const ServicesPage: React.FC = () => {
  const { services } = useData();
  const activeServices = services.filter(service => service.status === 'active');

  const mainServices = [
    {
      icon: Shield,
      title: 'Risk Assessment',
      description: 'Systematic evaluation of potential hazards, vulnerabilities, and risks to communities, infrastructure, and environment.',
      image: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
      color: 'bg-yellow-500',
      features: [
        'Hazard identification and mapping',
        'Vulnerability and capacity assessment',
        'Risk profiling and prioritization',
        'Climate change impact analysis'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Planning',
      description: 'Development of comprehensive emergency response plans to ensure coordinated and effective action during disasters.',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      color: 'bg-red-500',
      features: [
        'Contingency planning for all hazards',
        'Evacuation and shelter planning',
        'Resource allocation strategies',
        'Inter-agency coordination protocols'
      ]
    },
    {
      icon: Users,
      title: 'Community Training',
      description: 'Capacity building programs to empower communities with knowledge and skills for disaster preparedness and response.',
      image: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
      color: 'bg-green-500',
      features: [
        'Disaster preparedness workshops',
        'First aid and CPR training',
        'Search and rescue techniques',
        'Emergency communication skills'
      ]
    },
    {
      icon: Building,
      title: 'Barangay DRRM Planning',
      description: 'Workshops and training for barangay officials to develop localized disaster risk reduction and management plans.',
      image: 'https://images.pexels.com/photos/73833/worm-s-eye-view-us-flag-low-angle-shot-flag-73833.jpeg',
      color: 'bg-purple-500',
      features: [
        'Barangay contingency planning',
        'Local resource inventory systems',
        'Community mobilization strategies',
        'Early warning system implementation'
      ]
    },
    {
      icon: Shield,
      title: 'Early Warning Systems',
      description: 'Advanced monitoring and alert systems to provide timely information about impending disasters to communities.',
      image: 'https://images.pexels.com/photos/6146970/pexels-photo-6146970.jpeg',
      color: 'bg-sky-500',
      features: [
        'Real-time weather monitoring',
        'Sirens and alert mechanisms',
        'Mobile alert notifications',
        'Community-based warning networks'
      ]
    },
    {
      icon: Home,
      title: 'Infrastructure Resilience',
      description: 'Strengthening critical infrastructure to withstand natural disasters and ensure continuity of essential services.',
      image: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      color: 'bg-orange-500',
      features: [
        'Bridge and road reinforcement',
        'Flood control systems',
        'School and hospital fortification',
        'Utility system hardening'
      ]
    }
  ];

  const recoveryPhases = [
    {
      title: 'Immediate Response',
      icon: AlertTriangle,
      color: 'bg-blue-500',
      items: ['Damage assessment', 'Emergency relief distribution', 'Search and rescue operations']
    },
    {
      title: 'Medium-term Recovery',
      icon: Home,
      color: 'bg-green-500',
      items: ['Temporary housing solutions', 'Economic livelihood programs', 'Psychosocial support services']
    },
    {
      title: 'Long-term Rehabilitation',
      icon: Building,
      color: 'bg-purple-500',
      items: ['Permanent housing reconstruction', 'Infrastructure rebuilding', 'Community development projects']
    }
  ];

  const frameworkPhases = [
    { title: 'Prevention', description: 'Avoiding hazards and exposure to risks', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
    { title: 'Mitigation', description: 'Reducing the severity of disasters', color: 'text-red-500', bgColor: 'bg-red-100' },
    { title: 'Preparedness', description: 'Planning and readiness for emergencies', color: 'text-green-500', bgColor: 'bg-green-100' },
    { title: 'Response & Recovery', description: 'Effective emergency response and rehabilitation', color: 'text-blue-500', bgColor: 'bg-blue-100' }
  ];

  const emergencyContacts = [
    { name: 'MDRRMO Emergency Hotline', number: '911', description: 'Primary emergency response' },
    { name: 'Municipal Hall', number: '(052) 123-4567', description: 'General inquiries' },
    { name: 'Fire Department', number: '(052) 567-8901', description: 'Fire emergencies' },
    { name: 'Police Station', number: '117', description: 'Security and law enforcement' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>
      
      {/* Header */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-24 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-20 right-10 w-48 h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-2"></div>
          <div className="absolute -bottom-10 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-4"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8 animate-pulse-glow">
              <Shield className="text-blue-950" size={40} />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-text-glow">Disaster Risk Reduction Services</h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8 rounded-full"></div>
            <p className="text-xl md:text-2xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Comprehensive disaster management services to build resilient communities and ensure effective emergency response
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Services from Admin */}
      {activeServices.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Current Services</h2>
              <div className="w-24 h-1 bg-blue-500 mx-auto mb-6"></div>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Services currently offered by MDRRMO Pio Duran
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {activeServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-blue-600"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-4 rounded-full">
                      <Shield className="text-blue-600" size={24} />
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
        </section>
      )}

      {/* Services Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Core Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive disaster risk reduction and management services designed to protect and empower our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mainServices.map((service, index) => (
              <div key={index} className={`card-modern interactive-card shadow-modern-lg hover:shadow-modern-xl transition-all duration-500 stagger-${index + 1}`}>
                <div className="h-56 overflow-hidden relative">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-8">
                  <div className="flex items-center mb-4">
                    <div className={`${service.color} p-4 rounded-2xl mr-4 shadow-lg hover:scale-110 transition-transform duration-300`}>
                      <service.icon className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">{service.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>
                  <div className="space-y-4">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start group">
                        <CheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" size={18} />
                        <span className="text-gray-600 group-hover:text-gray-800 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recovery & Rehabilitation */}
      <section className="py-20 bg-gradient-to-br from-white to-blue-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Recovery & Rehabilitation</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full mb-8"></div>
          </div>
          
          <div className="card-modern shadow-modern-xl overflow-hidden mb-16">
            <div className="md:flex">
              <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                <img 
                  src="https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg" 
                  alt="Recovery & Rehabilitation" 
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="md:w-2/3 p-10">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl mr-6 shadow-lg animate-pulse-glow">
                    <Home className="text-white" size={32} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Recovery & Rehabilitation</h3>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                  Comprehensive post-disaster recovery programs focused on rebuilding communities stronger and more resilient than before.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recoveryPhases.map((phase, index) => (
                    <div key={index} className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:-translate-y-2 stagger-${index + 1}`}>
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <phase.icon className="text-blue-600 mr-3 hover:scale-110 transition-transform duration-200" size={24} />
                        {phase.title}
                      </h4>
                      <ul className="space-y-3 text-gray-700">
                        {phase.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start group">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-2 mr-3 flex-shrink-0 group-hover:scale-125 transition-transform duration-200"></div>
                            <span className="text-sm group-hover:text-gray-900 transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* National Framework */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                             linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="card-modern shadow-modern-xl p-12 relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">National Disaster Risk Reduction Framework</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full mb-8"></div>
            </div>
            <p className="text-xl text-gray-700 mb-12 max-w-5xl mx-auto text-center leading-relaxed">
              Aligned with the National Disaster Risk Reduction and Management Council (NDRRMC) guidelines, our services follow the comprehensive approach to disaster management which includes prevention, mitigation, preparedness, response, and recovery phases.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {frameworkPhases.map((phase, index) => (
                <div key={index} className={`text-center group hover:transform hover:-translate-y-4 transition-all duration-500 stagger-${index + 1}`}>
                  <div className={`${phase.bgColor} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    <Shield className={`${phase.color}`} size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">{phase.title}</h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-800 transition-colors">{phase.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts Section */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-3"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-500 rounded-full mb-8 animate-pulse-glow">
              <Phone className="text-blue-950" size={32} />
            </div>
            <h2 className="text-4xl font-bold mb-6 animate-text-glow">Emergency Contacts</h2>
            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
            <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
              Important contact numbers for emergency situations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className={`glass-dark rounded-2xl p-8 text-center hover:bg-blue-700/30 transition-all duration-500 hover:transform hover:-translate-y-4 hover:shadow-2xl stagger-${index + 1}`}>
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl hover:scale-110 transition-transform duration-300">
                  <Phone className="text-blue-950" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 hover:text-yellow-300 transition-colors">{contact.name}</h3>
                <a 
                  href={`tel:${contact.number.replace(/[^\d]/g, '')}`}
                  className="text-3xl font-bold text-yellow-500 hover:text-yellow-300 transition-all duration-300 block mb-3 hover:scale-110 transform"
                >
                  {contact.number}
                </a>
                <p className="text-blue-200 leading-relaxed">{contact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Section */}
      <section className="py-20 bg-gradient-to-br from-red-600 via-red-500 to-yellow-500 relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-morph-bg bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center relative z-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse-glow">
              <AlertTriangle className="text-white animate-pulse" size={40} />
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-text-glow">Need Emergency Assistance?</h3>
            <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto leading-relaxed">
              For immediate assistance during disasters or emergencies, contact the National Emergency Hotline
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <div className="bg-white text-red-600 font-bold py-6 px-12 rounded-2xl shadow-2xl flex items-center text-2xl hover:scale-105 transition-transform duration-300 hover:shadow-3xl">
                <Phone className="mr-4 animate-bounce" size={32} />
                <span>911 or (02) 8888-8888</span>
              </div>
            </div>
            <p className="text-white/80 mt-8 text-lg">
              For more information, visit{' '}
              <a href="https://ndrrmc.gov.ph/" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-yellow-200 transition-colors">
                NDRRMC Official Website
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;