import React from 'react';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'interactive';
  hover?: boolean;
  glow?: boolean;
  animation?: 'none' | 'float' | 'pulse' | 'bounce';
}

const ModernCard: React.FC<ModernCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  glow = false,
  animation = 'none'
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'glass':
        return 'glass-modern border border-white/20';
      case 'gradient':
        return 'bg-gradient-to-br from-white to-blue-50 border border-blue-200';
      case 'interactive':
        return 'interactive-card bg-white border border-gray-200';
      default:
        return 'card-modern bg-white border border-gray-200';
    }
  };

  const getHoverClasses = () => {
    if (!hover) return '';
    return 'hover-lift-modern';
  };

  const getGlowClasses = () => {
    if (!glow) return '';
    return 'hover-glow';
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'float':
        return 'animate-float';
      case 'pulse':
        return 'animate-pulse-glow';
      case 'bounce':
        return 'animate-bounce-in';
      default:
        return '';
    }
  };

  return (
    <div
      className={`
        ${getVariantClasses()}
        ${getHoverClasses()}
        ${getGlowClasses()}
        ${getAnimationClasses()}
        shadow-modern-lg
        rounded-2xl
        transition-all
        duration-500
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default ModernCard;