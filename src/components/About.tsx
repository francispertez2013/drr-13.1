import React from 'react';
import { Shield, Eye, ShieldMinus, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const About: React.FC = () => {
  const [aboutSections, setAboutSections] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchAboutSections();
  }, []);

  const fetchAboutSections = async () => {
    try {
      const { data, error } = await supabase
        .from('about_sections')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error && !error.message.includes('relation "about_sections" does not exist')) {
        throw error;
      }
      
      setAboutSections(data || []);
    } catch (error) {
      console.error('Error fetching about sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      icon: ShieldMinus,
      title: 'Mission',
      description: 'To ensure the safety and resilience of Pio Duran through effective disaster risk reduction and management.',
      color: 'text-blue-600'
    },
    {
      icon: Eye,
      title: 'Vision',
      description: 'A disaster-resilient community with zero casualties through proactive preparedness and efficient response.',
      color: 'text-green-600'
    },
    {
      icon: ShieldMinus,
      title: 'Goal',
      description: 'To reduce vulnerability and enhance capacity of communities to prepare for, respond to, and recover from disasters.',
      color: 'text-purple-600'
    }
  ];

  // Use dynamic sections if available, otherwise use default cards
  const displayCards = aboutSections.length > 0 
    ? aboutSections.map(section => ({
        icon: ShieldMinus, // Default icon, could be made dynamic
        title: section.title,
        description: section.content,
        color: 'text-blue-600'
      }))
    : cards;
  return (
    <section id="about" className="relative py-12 md:py-24 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 md:w-48 h-32 md:h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-20 right-10 w-32 md:w-48 h-32 md:h-48 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-40 md:w-64 h-40 md:h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-16">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-yellow-500 mt-10 mb-4 md:mb-6 relative">
            <span className="relative">About DRRM Pio Duran</span>
            <div className="absolute -bottom-1 md:-bottom-2 left-1/2 transform -translate-x-1/2 w-20 md:w-40 h-0.5 md:h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
          </h2>
          <p className="text-sm md:text-lg lg:text-xl text-blue-100 max-w-4xl mx-auto leading-relaxed px-4">
            MDRRMO Pio Duran is the central hub for all disaster risk reduction and management activities, ensuring coordinated responses and sustainable preparedness measures.
          </p>
        </div>

        <div className={`grid grid-cols-1 ${displayCards.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'} gap-6 md:gap-8 mb-8 md:mb-16`}>
          {displayCards.map((card, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-3 border border-white/20 hover:border-yellow-500/50 group"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300">
                  <card.icon size={32} className="text-blue-950" />
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-center mb-3 md:mb-4 text-yellow-500">
                {card.title}
              </h3>
              <p className="text-base md:text-lg text-blue-100 text-center leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/about"
            className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-5 overflow-hidden font-bold text-blue-950 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-xl md:shadow-2xl hover:shadow-2xl md:hover:shadow-3xl"
          >
            <Users className="mr-3 md:mr-4" size={24} />
            <span className="text-lg md:text-xl lg:text-2xl tracking-wide">Meet the DRRM Team</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;