import React, { useEffect, useRef } from 'react';

interface ModernAnimationsProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  className?: string;
}

const ModernAnimations: React.FC<ModernAnimationsProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 600,
  className = ''
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'opacity-0';
    
    switch (animation) {
      case 'fadeIn':
        return 'animate-fade-in';
      case 'slideUp':
        return 'animate-slide-up';
      case 'slideLeft':
        return 'animate-slide-left';
      case 'slideRight':
        return 'animate-slide-right';
      case 'scaleIn':
        return 'animate-scale-in';
      case 'rotateIn':
        return 'animate-rotate-in';
      case 'bounceIn':
        return 'animate-bounce-in';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all ${getAnimationClass()} ${className}`}
      style={{
        animationDuration: `${duration}ms`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export default ModernAnimations;