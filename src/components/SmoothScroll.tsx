import React, { useEffect } from 'react';

interface SmoothScrollProps {
  isActive: boolean;
  onStop: () => void;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ isActive, onStop }) => {
  useEffect(() => {
    if (!isActive) return;

    let animationId: number;
    let startTime: number;
    const duration = 2000; // 2 seconds scroll duration
    const startPosition = window.pageYOffset;
    const targetPosition = window.innerHeight; // Scroll one viewport height

    const scroll = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeInOutCubic = (t: number) => 
        t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      
      const currentPosition = startPosition + (targetPosition - startPosition) * easeInOutCubic(progress);
      window.scrollTo(0, currentPosition);
      
      if (progress < 1 && isActive) {
        animationId = requestAnimationFrame(scroll);
      } else {
        onStop();
      }
    };

    // Handle click to stop scrolling
    const handleClick = () => {
      if (isActive) {
        cancelAnimationFrame(animationId);
        onStop();
      }
    };

    // Handle escape key to stop scrolling
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isActive) {
        cancelAnimationFrame(animationId);
        onStop();
      }
    };

    if (isActive) {
      animationId = requestAnimationFrame(scroll);
      document.addEventListener('click', handleClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, onStop]);

  return null;
};

export default SmoothScroll;