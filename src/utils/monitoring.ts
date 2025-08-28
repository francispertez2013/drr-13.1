// System monitoring and health check utilities

interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime?: number;
  error?: string;
  timestamp: number;
}

interface SystemMetrics {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  performance: {
    navigation: number;
    paint: number;
    contentLoad: number;
  };
  errors: {
    count: number;
    recent: Error[];
  };
}

class MonitoringService {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private errorCount = 0;
  private recentErrors: Error[] = [];

  async checkDatabaseHealth(): Promise<HealthCheck> {
    const startTime = performance.now();
    
    try {
      // Test Supabase connection
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.from('news').select('count').limit(1);
      
      const responseTime = performance.now() - startTime;
      
      if (!error) {
        return {
          service: 'database',
          status: responseTime < 1000 ? 'healthy' : 'degraded',
          responseTime,
          timestamp: Date.now()
        };
      } else {
        throw error;
      }
    } catch (error) {
      return {
        service: 'database',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      };
    }
  }

  async checkSupabaseHealth(): Promise<HealthCheck> {
    const startTime = performance.now();
    
    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase.from('news').select('count').limit(1);
      
      const responseTime = performance.now() - startTime;
      
      if (error) throw error;
      
      return {
        service: 'supabase',
        status: responseTime < 2000 ? 'healthy' : 'degraded',
        responseTime,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        service: 'supabase',
        status: 'unhealthy',
        responseTime: performance.now() - startTime,
        error: error instanceof Error ? error.message : 'Connection failed',
        timestamp: Date.now()
      };
    }
  }

  getSystemMetrics(): SystemMetrics {
    const memory = (performance as any).memory || {};
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');

    return {
      memory: {
        used: memory.usedJSHeapSize || 0,
        total: memory.totalJSHeapSize || 0,
        percentage: memory.totalJSHeapSize 
          ? Math.round((memory.usedJSHeapSize / memory.totalJSHeapSize) * 100)
          : 0
      },
      performance: {
        navigation: navigation?.loadEventEnd - navigation?.navigationStart || 0,
        paint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        contentLoad: navigation?.domContentLoadedEventEnd - navigation?.navigationStart || 0
      },
      errors: {
        count: this.errorCount,
        recent: this.recentErrors.slice(-5)
      }
    };
  }

  recordError(error: Error): void {
    this.errorCount++;
    this.recentErrors.push(error);
    
    // Keep only last 10 errors
    if (this.recentErrors.length > 10) {
      this.recentErrors = this.recentErrors.slice(-10);
    }
  }

  async runHealthChecks(): Promise<HealthCheck[]> {
    const checks = await Promise.all([
      this.checkSupabaseHealth(),
      // Add more health checks as needed
    ]);

    checks.forEach(check => {
      this.healthChecks.set(check.service, check);
    });

    return checks;
  }

  getHealthStatus(): 'healthy' | 'degraded' | 'unhealthy' {
    const checks = Array.from(this.healthChecks.values());
    
    if (checks.length === 0) return 'healthy';
    
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;
    
    if (unhealthyCount > 0) return 'unhealthy';
    if (degradedCount > 0) return 'degraded';
    
    return 'healthy';
  }

  startMonitoring(interval: number = 30000): void {
    // Run initial health check
    this.runHealthChecks();
    
    // Set up periodic monitoring
    setInterval(() => {
      this.runHealthChecks();
    }, interval);
  }
}

export const monitoring = new MonitoringService();

// Initialize monitoring
if (typeof window !== 'undefined') {
  monitoring.startMonitoring();
  
  // Global error handler
  window.addEventListener('error', (event) => {
    monitoring.recordError(event.error);
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    monitoring.recordError(new Error(event.reason));
  });
}