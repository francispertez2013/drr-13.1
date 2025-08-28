import React from 'react';
import { Loader } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader className={`${sizeClasses[size]} text-blue-600 animate-spin`} />
      <p className={`${textSizes[size]} text-gray-600 font-medium`}>{text}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 ${className}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      {content}
    </div>
  );
};

export default LoadingSpinner;