// Modern animation utilities for production-ready applications

export const animationConfig = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
    slower: 800
  },
  easing: {
    easeOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    elastic: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  }
};

export const createStaggeredAnimation = (
  elements: NodeListOf<Element> | Element[],
  animationClass: string,
  delay: number = 100
) => {
  Array.from(elements).forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delay);
  });
};

export const observeElementsForAnimation = (
  selector: string,
  animationClass: string,
  options: IntersectionObserverInit = {}
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  });

  document.querySelectorAll(selector).forEach((element) => {
    observer.observe(element);
  });

  return observer;
};

export const createParallaxEffect = (
  element: HTMLElement,
  speed: number = 0.5
) => {
  const handleScroll = () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -speed;
    element.style.transform = `translateY(${rate}px)`;
  };

  window.addEventListener('scroll', handleScroll);
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
};

export const createMorphingBackground = (
  element: HTMLElement,
  colors: string[],
  duration: number = 8000
) => {
  let currentIndex = 0;
  
  const morphColors = () => {
    const nextIndex = (currentIndex + 1) % colors.length;
    element.style.background = `linear-gradient(135deg, ${colors[currentIndex]}, ${colors[nextIndex]})`;
    currentIndex = nextIndex;
  };

  morphColors(); // Initial color
  const interval = setInterval(morphColors, duration);
  
  return () => clearInterval(interval);
};

export const createFloatingElements = (
  container: HTMLElement,
  count: number = 20,
  className: string = 'floating-particle'
) => {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = className;
    particle.style.cssText = `
      position: absolute;
      width: ${Math.random() * 10 + 5}px;
      height: ${Math.random() * 10 + 5}px;
      background: rgba(234, 179, 8, ${Math.random() * 0.5 + 0.2});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
    `;
    container.appendChild(particle);
  }
};

export const createRippleEffect = (
  element: HTMLElement,
  color: string = 'rgba(255, 255, 255, 0.6)'
) => {
  element.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: ${color};
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
};

// CSS-in-JS animations
export const keyframes = {
  ripple: `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `,
  
  glowPulse: `
    @keyframes glowPulse {
      0%, 100% {
        box-shadow: 0 0 20px rgba(234, 179, 8, 0.4);
      }
      50% {
        box-shadow: 0 0 40px rgba(234, 179, 8, 0.8);
      }
    }
  `,
  
  morphShape: `
    @keyframes morphShape {
      0%, 100% {
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
      }
      50% {
        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
      }
    }
  `
};

// Inject keyframes into document
export const injectKeyframes = () => {
  const style = document.createElement('style');
  style.textContent = Object.values(keyframes).join('\n');
  document.head.appendChild(style);
};

// Performance-optimized animation utilities
export const useGPUAcceleration = (element: HTMLElement) => {
  element.style.transform = 'translateZ(0)';
  element.style.willChange = 'transform';
};

export const optimizeAnimationPerformance = () => {
  // Reduce animations on low-end devices
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    document.documentElement.style.setProperty('--animation-duration', '0.2s');
  }
  
  // Respect user's motion preferences
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
  }
};

// Initialize animations on page load
export const initializeModernAnimations = () => {
  injectKeyframes();
  optimizeAnimationPerformance();
  
  // Add ripple effects to buttons
  document.querySelectorAll('button, .btn').forEach((button) => {
    createRippleEffect(button as HTMLElement);
  });
  
  // Observe elements for scroll animations
  observeElementsForAnimation('.animate-on-scroll', 'animate-fade-in');
  observeElementsForAnimation('.stagger-animation', 'animate-slide-up');
};