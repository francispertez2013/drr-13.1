// Production utilities and optimizations

export class ProductionOptimizer {
  // Performance monitoring
  static measurePerformance(name: string, fn: () => void | Promise<void>) {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
      });
    } else {
      const end = performance.now();
      console.log(`${name} took ${end - start} milliseconds`);
      return result;
    }
  }

  // Memory usage monitoring
  static getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return null;
  }

  // Bundle size analysis
  static analyzeBundleSize() {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    
    return {
      scripts: scripts.length,
      styles: styles.length,
      totalAssets: scripts.length + styles.length
    };
  }

  // Network monitoring
  static getNetworkInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  // Error boundary for production
  static createErrorBoundary(component: React.ComponentType) {
    return class extends React.Component {
      state = { hasError: false, error: null };

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Production Error:', error, errorInfo);
        
        // Send to monitoring service in production
        if (process.env.NODE_ENV === 'production') {
          // analytics.trackError(error.message, 'component_error');
        }
      }

      render() {
        if (this.state.hasError) {
          return React.createElement('div', {
            className: 'min-h-screen bg-gray-50 flex items-center justify-center p-4'
          }, [
            React.createElement('div', {
              key: 'error-container',
              className: 'max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center'
            }, [
              React.createElement('h1', {
                key: 'title',
                className: 'text-2xl font-bold text-gray-900 mb-2'
              }, 'Something went wrong'),
              React.createElement('p', {
                key: 'message',
                className: 'text-gray-600 mb-6'
              }, 'Please refresh the page or contact support if the problem persists.'),
              React.createElement('button', {
                key: 'reload',
                className: 'bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors',
                onClick: () => window.location.reload()
              }, 'Reload Page')
            ])
          ]);
        }

        return React.createElement(component, this.props);
      }
    };
  }

  // Service worker registration
  static async registerServiceWorker(): Promise<boolean> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        return true;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
        return false;
      }
    }
    return false;
  }

  // Progressive Web App utilities
  static async enablePWA() {
    // Register service worker
    await this.registerServiceWorker();
    
    // Handle install prompt
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });
    
    return {
      canInstall: () => !!deferredPrompt,
      install: async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          deferredPrompt = null;
          return outcome === 'accepted';
        }
        return false;
      }
    };
  }
}

export const production = ProductionOptimizer;