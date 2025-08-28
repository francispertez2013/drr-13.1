import React, { useState, useEffect } from 'react';
import { Shield, Zap, Globe, Activity } from 'lucide-react';

type Feature = {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  color: string;
  stats: Record<string, string>;
};

const ProductionFeatures: React.FC = () => {
  // Define features first to avoid TDZ issues
  const features: Feature[] = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Bank-level security with end-to-end encryption, secure authentication, and data protection.',
      color: 'from-blue-500 to-blue-600',
      stats: { uptime: '99.9%', security: 'A+', compliance: 'SOC 2' },
    },
    {
      icon: Zap,
      title: 'Lightning Performance',
      description:
        'Optimized for speed with CDN delivery, caching strategies, and performance monitoring.',
      color: 'from-yellow-500 to-orange-500',
      stats: { loadTime: '<2s', performance: '95+', optimization: 'A+' },
    },
    {
      icon: Globe,
      title: 'Global Accessibility',
      description:
        'WCAG 2.1 compliant with multi-language support and responsive design for all devices.',
      color: 'from-green-500 to-emerald-500',
      stats: { accessibility: 'AAA', languages: '3+', devices: '100%' },
    },
    {
      icon: Activity,
      title: 'Real-time Analytics',
      description:
        'Comprehensive analytics dashboard with real-time monitoring and detailed insights.',
      color: 'from-purple-500 to-indigo-500',
      stats: { tracking: '24/7', insights: 'Real-time', reports: 'Custom' },
    },
  ];

  const [activeFeature, setActiveFeature] = useState<number>(0);

  // Auto-rotate features (each 4 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Icon component for the currently active feature
  const ActiveIcon = features[activeFeature].icon;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute top-10 left-10 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-float stagger-3"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-text-glow">
            Production-Ready Features
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full mb-8"></div>
          <p className="text-xl text-blue-200 max-w-4xl mx-auto leading-relaxed">
            Built with enterprise-grade features for reliability, security, and performance
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Feature Cards */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`glass-modern rounded-2xl p-6 border transition-all duration-500 cursor-pointer ${
                  activeFeature === index
                    ? 'border-yellow-500 bg-yellow-500/10 shadow-xl scale-105'
                    : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                    <feature.icon className="text-white" size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-blue-200 leading-relaxed">{feature.description}</p>
                  </div>
                </div>

                {activeFeature === index && (
                  <div className="mt-6 grid grid-cols-3 gap-4 animate-fade-in">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-yellow-400 font-bold text-lg">{value}</div>
                        <div className="text-blue-300 text-sm capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Feature Showcase */}
          <div className="relative">
            <div className="glass-modern rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center">
                <div
                  className={`w-24 h-24 bg-gradient-to-br ${features[activeFeature].color} rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow`}
                >
                  <ActiveIcon className="text-white" size={48} />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-blue-200 text-lg leading-relaxed mb-8">
                  {features[activeFeature].description}
                </p>

                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(features[activeFeature].stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">{value}</div>
                      <div className="text-blue-300 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature indicators */}
        <div className="flex justify-center mt-12 space-x-3">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveFeature(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeFeature === index
                  ? 'bg-yellow-500 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to feature ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductionFeatures;