import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface ModernButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  glow?: boolean;
  gradient?: boolean;
}

const ModernButton: React.FC<ModernButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  glow = false,
  gradient = true
}) => {
  const getVariantClasses = () => {
    const baseClasses = 'font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-opacity-50';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} ${gradient ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-blue-600 hover:bg-blue-700'} text-white focus:ring-blue-300 shadow-lg hover:shadow-xl`;
      case 'secondary':
        return `${baseClasses} ${gradient ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800' : 'bg-gray-600 hover:bg-gray-700'} text-white focus:ring-gray-300 shadow-lg hover:shadow-xl`;
      case 'danger':
        return `${baseClasses} ${gradient ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800' : 'bg-red-600 hover:bg-red-700'} text-white focus:ring-red-300 shadow-lg hover:shadow-xl`;
      case 'success':
        return `${baseClasses} ${gradient ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-green-600 hover:bg-green-700'} text-white focus:ring-green-300 shadow-lg hover:shadow-xl`;
      case 'warning':
        return `${baseClasses} ${gradient ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'} text-blue-950 focus:ring-yellow-300 shadow-lg hover:shadow-xl`;
      case 'ghost':
        return `${baseClasses} bg-transparent border-2 border-current hover:bg-current hover:text-white focus:ring-blue-300`;
      default:
        return baseClasses;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-4 py-2 text-sm rounded-lg';
      case 'md':
        return 'px-6 py-3 text-base rounded-xl';
      case 'lg':
        return 'px-8 py-4 text-lg rounded-2xl';
      case 'xl':
        return 'px-12 py-5 text-xl rounded-2xl';
      default:
        return 'px-6 py-3 text-base rounded-xl';
    }
  };

  const getGlowClasses = () => {
    if (!glow) return '';
    return 'animate-pulse-glow';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${getGlowClasses()}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center gap-3
        ${className}
      `}
    >
      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
      )}
      
      {Icon && iconPosition === 'left' && !loading && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} className="hover:animate-bounce" />
      )}
      
      <span>{children}</span>
      
      {Icon && iconPosition === 'right' && !loading && (
        <Icon size={size === 'sm' ? 16 : size === 'lg' ? 24 : size === 'xl' ? 28 : 20} className="hover:animate-bounce" />
      )}
    </button>
  );
};

export default ModernButton;