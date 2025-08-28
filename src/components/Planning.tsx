import React, { useState } from 'react';
import { MapPin, Bell, Route, Leaf, Building, Handshake, Shield, Users, Target, BarChart3, ChevronRight, CheckCircle, ArrowRight, Download, FileText, Calendar, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Planning: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const planningAreas = [
    {
      icon: MapPin,
      title: 'Risk Assessment & Hazard Mapping',
      description: 'Advanced GIS technology for identifying vulnerable areas and creating comprehensive disaster risk maps.',
      features: ['Interactive hazard mapping', 'Vulnerability assessments', 'Climate data analysis', 'Real-time monitoring'],
      color: 'from-blue-500 to-cyan-600',
      accent: 'blue',
      stats: { coverage: '100%', accuracy: '95%', updates: 'Monthly' }
    },
    {
      icon: Bell,
      title: 'Early Warning Systems',
      description: 'Multi-channel alert systems providing real-time notifications for various disaster types.',
      features: ['SMS/Mobile alerts', 'Siren networks', 'Social media integration', 'Community radio'],
      color: 'from-yellow-500 to-orange-600',
      accent: 'yellow',
      stats: { coverage: '98%', response: '< 2 min', channels: '5+' }
    },
    {
      icon: Route,
      title: 'Evacuation Planning',
      description: 'Comprehensive evacuation strategies with designated safe zones and optimized routes.',
      features: ['Route optimization', 'Shelter management', 'Transportation coordination', 'Special needs planning'],
      color: 'from-red-500 to-pink-600',
      accent: 'red',
      stats: { routes: '25+', shelters: '15', capacity: '10K+' }
    },
    {
      icon: Leaf,
      title: 'Climate Adaptation',
      description: 'Sustainable environmental solutions and green infrastructure for long-term resilience.',
      features: ['Green infrastructure', 'Ecosystem restoration', 'Sustainable development', 'Carbon reduction'],
      color: 'from-green-500 to-emerald-600',
      accent: 'green',
      stats: { projects: '12', impact: 'High', timeline: '5 years' }
    },
    {
      icon: Building,
      title: 'Infrastructure Resilience',
      description: 'Engineering solutions to strengthen community structures against natural disasters.',
      features: ['Structural assessments', 'Retrofitting programs', 'Building codes', 'Critical facilities'],
      color: 'from-purple-500 to-violet-600',
      accent: 'purple',
      stats: { buildings: '500+', compliance: '90%', upgrades: 'Ongoing' }
    },
    {
      icon: Handshake,
      title: 'Multi-Sector Collaboration',
      description: 'Strategic partnerships with government, NGOs, and private sector for comprehensive response.',
      features: ['Inter-agency coordination', 'Public-private partnerships', 'NGO collaboration', 'International cooperation'],
      color: 'from-indigo-500 to-blue-600',
      accent: 'indigo',
      stats: { partners: '25+', agreements: '15', coverage: 'Regional' }
    }
  ];

  const planningProcess = [
    {
      step: 1,
      title: 'Assessment',
      description: 'Comprehensive risk and vulnerability analysis',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600'
    },
    {
      step: 2,
      title: 'Planning',
      description: 'Strategic plan development and resource allocation',
      icon: FileText,
      color: 'from-green-500 to-green-600'
    },
    {
      step: 3,
      title: 'Implementation',
      description: 'Execute plans through training and infrastructure',
      icon: Zap,
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      step: 4,
      title: 'Monitoring',
      description: 'Continuous evaluation and improvement',
      icon: Target,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const achievements = [
    { value: '95%', label: 'Community Preparedness', description: 'Households with emergency plans' },
    { value: '40+', label: 'Training Programs', description: 'Annual capacity building sessions' },
    { value: '0', label: 'Disaster Fatalities', description: 'Zero casualties in past 3 years' },
    { value: '25+', label: 'Partner Organizations', description: 'Active collaboration network' }
  ];

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
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-10 md:mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl md:rounded-3xl mb-4 md:mb-8 shadow-lg md:shadow-2xl">
            <Shield className="text-white" size={24} />
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">
            Disaster Risk Reduction &
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mt-1 md:mt-0">
              Management Planning
            </span>
          </h2>
          <div className="w-20 md:w-32 h-1 md:h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto rounded-full mb-4 md:mb-8"></div>
          <p className="text-sm md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
            Building resilient communities through comprehensive planning, innovative strategies, and collaborative partnerships
          </p>
        </div>

        {/* Planning Process Timeline */}
        <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
          <div className="text-center mb-5">
            <h3 className="text-3xl font-bold text-white mb-3">Our Planning Process</h3>
            <p className="text-blue-200 max-w-2xl mx-auto">
              A systematic approach to building disaster resilience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {planningProcess.map((step, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">{step.step}</span>
                  </div>
                  <div className="text-center">
                    <step.icon className="text-white mx-auto mb-4" size={32} />
                    <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                    <p className="text-blue-200 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
                
                {/* Connector Arrow */}
                {index < planningProcess.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="text-white/40" size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Planning Areas Grid */}
        <div className={`mb-20 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '500ms' }}>
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Strategic Planning Areas</h3>
            <p className="text-blue-200 max-w-2xl mx-auto">
              Comprehensive approaches to disaster risk reduction and community resilience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planningAreas.map((area, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:transform hover:-translate-y-3 cursor-pointer"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${area.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`relative w-16 h-16 bg-gradient-to-br ${area.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                  <area.icon className="text-white" size={32} />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h4 className="text-xl font-bold text-white mb-4 group-hover:text-yellow-300 transition-colors">
                    {area.title}
                  </h4>
                  <p className="text-blue-200 mb-6 leading-relaxed">
                    {area.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="space-y-2 mb-6">
                    {area.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-blue-100">
                        <CheckCircle size={14} className="text-green-400 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                    {Object.entries(area.stats).map(([key, value], statIndex) => (
                      <div key={statIndex} className="text-center">
                        <div className="text-white font-bold text-sm">{value}</div>
                        <div className="text-blue-300 text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Hover Arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <ChevronRight className="text-white" size={20} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Map Section */}
        <div className={`mb-4 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`} style={{ animationDelay: '800ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold text-white mb-6">
                Interactive Hazard Mapping
              </h3>
              <p className="text-blue-200 mb-8 text-lg leading-relaxed">
                Explore our comprehensive hazard mapping system powered by advanced GIS technology. 
                Understand risks in your area and access real-time disaster information.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Real-time hazard monitoring</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Interactive evacuation routes</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Community vulnerability assessments</span>
                </div>
                <div className="flex items-center text-blue-100">
                  <CheckCircle className="text-green-400 mr-3" size={20} />
                  <span>Climate change projections</span>
                </div>
              </div>
              
              <Link 
                to="/disaster-planning"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-2xl hover:from-yellow-400 hover:to-orange-500 transition-all duration-300 font-bold shadow-2xl hover:shadow-3xl transform hover:scale-105 group"
              >
                <MapPin className="mr-3 group-hover:animate-bounce" size={24} />
                Explore Interactive Map
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-3 border border-white/20 shadow-2xl">
                <div className="aspect-video rounded-2xl overflow-hidden relative">
                  <iframe 
                    src="https://www.google.com/maps/d/embed?mid=12eKHRMUMYnO5lZOiaJQOA9cJD-xjXU8&hl=en&ehbc=2E312F" 
                    width="100%" 
                    height="100%"
                    style={{ border: 0, borderRadius: '1rem' }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Interactive Hazard Map - Pio Duran"
                    className="w-full h-full"
                  />
                  
                  {/* Overlay for better integration */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/10 via-transparent to-black/10 rounded-2xl">                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Planning;