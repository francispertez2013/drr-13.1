import React from 'react';
import { Shield, Eye, Target, Users, Handshake, Leaf, Building, GraduationCap, Database, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AboutPage: React.FC = () => {
  const [organizationalHierarchy, setOrganizationalHierarchy] = React.useState<any[]>([]);
  const [keyPersonnel, setKeyPersonnel] = React.useState<any[]>([]);
  const [aboutSections, setAboutSections] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const [hierarchyData, personnelData, sectionsData] = await Promise.all([
        supabase.from('organizational_hierarchy').select('*').eq('is_active', true).order('level').order('order_index'),
        supabase.from('key_personnel').select('*').eq('is_active', true).order('order_index'),
        supabase.from('about_sections').select('*').eq('is_active', true).order('order_index')
      ]);

      setOrganizationalHierarchy(hierarchyData.data || []);
      setKeyPersonnel(personnelData.data || []);
      setAboutSections(sectionsData.data || []);
    } catch (error) {
      console.error('Error fetching about data:', error);
    } finally {
      setLoading(false);
    }
  };

  const coreValues = [
    {
      icon: Handshake,
      title: 'Integrity',
      description: 'Upholding honesty and ethical standards in all our actions and decisions',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Users,
      title: 'Community Partnership',
      description: 'Working collaboratively with stakeholders for collective disaster resilience',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Shield,
      title: 'Resilience',
      description: 'Building strong, adaptive communities capable of withstanding disasters',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description: 'Promoting environmentally conscious and long-term disaster management',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const programs = [
    {
      icon: GraduationCap,
      title: 'Community Education Workshops',
      description: 'Regular training sessions to educate residents on disaster preparedness and response techniques.',
      features: ['Quarterly community assemblies', 'Focus group discussions with vulnerable sectors', 'Feedback mechanisms for continuous improvement']
    },
    {
      icon: Shield,
      title: 'Early Warning Systems',
      description: 'Advanced monitoring and alert systems to provide timely information during potential disasters.',
      features: ['Real-time weather monitoring', 'Multi-channel alert systems', 'Community-based warning networks']
    },
    {
      icon: Users,
      title: 'Emergency Response Drills',
      description: 'Regular simulation exercises to test and improve community response capabilities.',
      features: ['Evacuation drills', 'Search and rescue exercises', 'Inter-agency coordination drills']
    },
    {
      icon: Database,
      title: 'Risk Assessment Projects',
      description: 'Comprehensive studies to identify and evaluate potential hazards and vulnerabilities.',
      features: ['Hazard mapping', 'Vulnerability assessments', 'Climate change impact studies']
    }
  ];

  const defaultKeyPersonnel = [
    {
      name: 'Engr. Maria Santos',
      designation: 'MDRRMO Director',
      bio: '15+ years experience in disaster management and civil engineering. Leads strategic planning and policy development.',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    },
    {
      name: 'Dr. Juan Dela Cruz',
      designation: 'Deputy Director',
      bio: 'Expert in emergency response coordination and community engagement. Oversees field operations and training programs.',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    },
    {
      name: 'Ana Reyes',
      designation: 'Training Coordinator',
      bio: 'Specializes in capacity building and educational programs. Coordinates all training and workshop activities.',
      photo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'
    }
  ];

  // Use database data if available, otherwise use defaults
  const displayPersonnel = keyPersonnel.length > 0 ? keyPersonnel : defaultKeyPersonnel;
  const displayHierarchy = organizationalHierarchy.length > 0 ? organizationalHierarchy : [];

  const achievements = [
    { value: '95%', label: 'Community Preparedness', description: 'Households with emergency plans and disaster kits' },
    { value: '40+', label: 'Training Programs', description: 'Conducted annually for community members and officials' },
    { value: '0', label: 'Disaster Fatalities', description: 'In the past 3 years due to effective preparedness' }
  ];

  const partnerships = [
    { name: 'Provincial DRRM Office', description: 'Coordination on regional disaster management strategies', icon: 'fas fa-landmark', color: 'text-red-600', bgColor: 'bg-red-100' },
    { name: 'Red Cross', description: 'Joint emergency response and relief operations', icon: 'fas fa-hands-helping', color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: 'Local Schools', description: 'Educational programs and student training initiatives', icon: 'fas fa-school', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: 'Barangay Councils', description: 'Grassroots implementation and community mobilization', icon: 'fas fa-building', color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 md:w-48 h-32 md:h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute top-20 right-10 w-32 md:w-48 h-32 md:h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-2"></div>
        <div className="absolute -bottom-10 left-20 w-40 md:w-64 h-40 md:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-4"></div>
      </div>
      
      {/* Animated particles */}
      <div className="absolute inset-0 particle-bg"></div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 relative z-10">
            <h1 className="text-4xl text-yellow-500 md:text-6xl font-bold mb-6 animate-text-glow">About DRRM Pio Duran</h1>
            <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto mb-8 rounded-full animate-pulse-glow"></div>
          </div>
          
         
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Municipal Disaster Risk Reduction and Management Office</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Established to strengthen the municipality's capacity to manage disaster risks, the MDRRMO Pio Duran plays a crucial role in protecting lives and properties. Since its inception, the office has been instrumental in developing comprehensive disaster management strategies and building community resilience against various hazards.
              </p>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Located in the heart of Pio Duran, our office serves as the central hub for all disaster risk reduction and management activities, ensuring coordinated responses and sustainable preparedness measures.
              </p>
            </div>
        <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-8 inline-block">
                <Target className="h-24 w-24 text-yellow-500 mb-4 mx-auto" />
                <h3 className="text-xl text-yellow-500 font-bold mb-2">Our Vision</h3>
                <p className="text-gray-300">To build a disaster-resilient community where every citizen of Pio Duran is safe, informed, and empowered. We aspire to be a leading example of effective disaster communication in the province of Albay.</p>
              </div>
            </div>
          <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-8 inline-block">
                <Eye className="h-24 w-24 text-yellow-500 mb-4 mx-auto" />
                <h3 className="text-xl text-yellow-500 font-bold mb-2">Our Mission</h3>
                <p className="text-gray-300">To safeguard lives and property by delivering timely, accurate, and clear disaster information through all available channels. We are dedicated to educating the public and ensuring warnings are understood and acted upon.</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-16">
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Our Goal</h3>
              <p className="text-gray-300 leading-relaxed">The primary goal is to achieve zero casualties and minimize damage from disasters through proactive public communication. We will ensure everyone in our community receives critical information to make life-saving decisions.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4 text-yellow-500">Our Objectives</h3>
              <p className="text-gray-300 leading-relaxed">Our key objectives are to establish a robust multi-channel warning system that reaches every barangay instantly. We will also focus on continuous public education and building a network of trained community information officers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Core Values</h2>
            <div className="w-24 h-1 bg-blue-700 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The fundamental principles that guide our operations and decision-making processes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => (
              <div key={index} className="text-center bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className={`${value.color} text-2xl`} size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Operational Structure Section */}
     <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20">
        {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-3 left-3 w-20 md:w-30 h-32 md:h-30 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-5 right-5 w-20 md:w-30 h-32 md:h-30 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 left-10 w-25 md:w-40 h-25 md:h-30 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
       
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Operational Structure</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Our organizational framework ensures efficient coordination and effective implementation of disaster risk reduction and management activities
            </p>
          </div>

          {displayHierarchy.length > 0 ? (
            <div className="bg-gray-800 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Organizational Hierarchy</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayHierarchy.map((person, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-6 text-center">
                    <img
                      src={person.photo || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'}
                      alt={person.name}
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h4 className="text-lg font-bold text-white mb-1">{person.name}</h4>
                    <p className="text-yellow-500 mb-2">{person.designation}</p>
                    <p className="text-gray-300 text-sm">{person.department}</p>
                    <span className="inline-block mt-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Level {person.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 mb-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Organizational Hierarchy</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg">
                  MDRRMO Director
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="bg-blue-600 px-6 py-3 rounded-lg text-center">
                    Deputy Director
                  </div>
                  <div className="bg-blue-600 px-6 py-3 rounded-lg text-center">
                    Administrative Officer
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 w-full max-w-4xl">
                  <div className="bg-gray-700 px-4 py-3 rounded-lg text-center">
                    Preparedness & Response Team
                  </div>
                  <div className="bg-gray-700 px-4 py-3 rounded-lg text-center">
                    Training & Capacity Building Unit
                  </div>
                  <div className="bg-gray-700 px-4 py-3 rounded-lg text-center">
                    Data Management & Analysis Unit
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Shield className="text-yellow-500 text-2xl mr-3" size={32} />
                <h3 className="text-xl font-bold">Disaster Preparedness and Response Team</h3>
              </div>
              <p className="text-gray-300">
                Coordinates disaster responses, conducts preparedness activities, and manages emergency operations during crisis situations.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <GraduationCap className="text-yellow-500 text-2xl mr-3" size={32} />
                <h3 className="text-xl font-bold">Training and Capacity Building Unit</h3>
              </div>
              <p className="text-gray-300">
                Responsible for training community members, local officials, and staff on disaster risk management and emergency response protocols.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <Database className="text-yellow-500 text-2xl mr-3" size={32} />
                <h3 className="text-xl font-bold">Data Management and Analysis Unit</h3>
              </div>
              <p className="text-gray-300">
                Collects, analyzes, and maintains disaster-related data to inform decision-making and improve risk assessment strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs and Initiatives Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Programs and Initiatives</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our comprehensive programs aim to build community resilience and enhance disaster preparedness
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programs.map((program, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <program.icon className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{program.title}</h3>
                <p className="text-gray-600 mb-4">{program.description}</p>
                <div className="space-y-2">
                  {program.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Personnel Section */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20">
        {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-3 left-3 w-20 md:w-30 h-32 md:h-30 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-5 right-5 w-20 md:w-30 h-32 md:h-30 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 left-10 w-25 md:w-40 h-25 md:h-30 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Personnel</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Meet the dedicated professionals leading our disaster risk reduction and management efforts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPersonnel.map((person, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <img
                  src={person.photo || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg'}
                  alt={person.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold mb-2">{person.name}</h3>
                <p className="text-yellow-500 mb-3">{person.designation}</p>
                <p className="text-gray-300 text-sm">{person.bio}</p>
                {person.email && (
                  <p className="text-blue-300 text-xs mt-2">📧 {person.email}</p>
                )}
                {person.phone && (
                  <p className="text-blue-300 text-xs">📞 {person.phone}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements and Impact Section */}
       <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Achievements and Impact</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our commitment to disaster risk reduction has yielded significant results for the community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">{achievement.value}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{achievement.label}</h3>
                <p className="text-gray-600">{achievement.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Case Study: Flood Early Warning System</h3>
            <p className="text-gray-600 mb-4">
              Our innovative flood monitoring system has successfully provided early warnings to 15 barangays, 
              enabling timely evacuations and preventing significant property damage during the 2023 rainy season.
            </p>
            <div className="flex items-center text-blue-600 font-semibold">
              <Award className="mr-2" size={20} />
              <span>Impact: 3,000+ residents safely evacuated, zero casualties</span>
            </div>
          </div>
        </div>
      </section>

      {/* Collaborations and Partnerships Section */}
      <section className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-20">
        {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-3 left-3 w-20 md:w-30 h-32 md:h-30 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-5 right-5 w-20 md:w-30 h-32 md:h-30 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-4 left-10 w-25 md:w-40 h-25 md:h-30 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
        
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Collaborations and Partnerships</h2>
            <div className="w-24 h-1 bg-yellow-500 mx-auto mb-6"></div>
            <p className="text-gray-300 max-w-3xl mx-auto">
              Strengthening our disaster management capabilities through strategic partnerships
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerships.map((partnership, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 text-center">
                <div className={`w-16 h-16 ${partnership.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Building className={`${partnership.color} text-2xl`} size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">{partnership.name}</h3>
                <p className="text-gray-300 text-sm">{partnership.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Plans Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative">
        {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%),
                           linear-gradient(-45deg, transparent 48%, rgba(59, 130, 246, 0.05) 48%, rgba(59, 130, 246, 0.05) 52%, transparent 52%)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Future Plans and Goals</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our strategic roadmap for enhancing disaster risk reduction efforts in Pio Duran
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Strategic Initiatives</h3>
              <div className="space-y-6">
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">1</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">Climate Change Adaptation</h4>
                    <p className="text-gray-600">
                      Developing long-term strategies to address climate-related risks and vulnerabilities
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">2</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">Technology Integration</h4>
                    <p className="text-gray-600">
                      Implementing advanced GIS mapping and real-time monitoring systems
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-gray-900 font-bold">3</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-gray-800">Youth Empowerment</h4>
                    <p className="text-gray-600">
                      Establishing disaster risk reduction clubs in all schools and universities
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800">Upcoming Programs</h3>
              <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <Target className="text-yellow-500 mr-3" size={24} />
                  <h4 className="text-lg font-bold text-gray-800">Multi-Hazard Risk Assessment</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  Comprehensive evaluation of all potential hazards affecting Pio Duran
                </p>
                <span className="text-sm text-yellow-600 font-medium">Target Completion: 2024 Q3</span>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-3">
                  <Building className="text-yellow-500 mr-3" size={24} />
                  <h4 className="text-lg font-bold text-gray-800">Mobile Emergency App</h4>
                </div>
                <p className="text-gray-600 mb-3">
                  Development of a community-based emergency reporting and response application
                </p>
                <span className="text-sm text-yellow-600 font-medium">Target Launch: 2025 Q1</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;