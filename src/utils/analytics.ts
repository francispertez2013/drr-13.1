// Analytics and tracking utilities

interface AnalyticsEvent {
  event: string;
  category: string;
  label?: string;
  value?: number;
  customData?: Record<string, any>;
}

class AnalyticsManager {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeSession();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private initializeSession(): void {
    this.track('session_start', 'engagement');
    
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track('page_hidden', 'engagement');
      } else {
        this.track('page_visible', 'engagement');
      }
    });

    // Track page unload
    window.addEventListener('beforeunload', () => {
      this.track('session_end', 'engagement');
      this.flush();
    });
  }

  track(event: string, category: string, label?: string, value?: number, customData?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      label,
      value,
      customData: {
        ...customData,
        timestamp: Date.now(),
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    this.events.push(analyticsEvent);
    
    // Auto-flush every 10 events or 30 seconds
    if (this.events.length >= 10) {
      this.flush();
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    this.track('user_identified', 'user', userId);
  }

  trackPageView(page: string): void {
    this.track('page_view', 'navigation', page);
  }

  trackDownload(resourceId: string, resourceName: string): void {
    this.track('download', 'resource', resourceName, 1, { resourceId });
  }

  trackIncidentReport(incidentType: string): void {
    this.track('incident_report', 'emergency', incidentType);
  }

  trackEmergencyCall(): void {
    this.track('emergency_call', 'emergency');
  }

  trackSearch(query: string, results: number): void {
    this.track('search', 'interaction', query, results);
  }

  trackError(error: string, context: string): void {
    this.track('error', 'system', context, 1, { error });
  }

  private async flush(): Promise<void> {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      // In production, send to your analytics service
      console.log('Analytics events:', eventsToSend);
      
      // Store locally for now
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      localStorage.setItem('analytics_events', JSON.stringify([...existingEvents, ...eventsToSend]));
    } catch (error) {
      console.error('Failed to send analytics:', error);
      // Re-add events to queue
      this.events.unshift(...eventsToSend);
    }
  }

  getSessionStats(): any {
    const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
    const sessionEvents = events.filter((e: any) => e.customData?.sessionId === this.sessionId);
    
    return {
      sessionId: this.sessionId,
      eventCount: sessionEvents.length,
      pageViews: sessionEvents.filter((e: any) => e.event === 'page_view').length,
      downloads: sessionEvents.filter((e: any) => e.event === 'download').length,
      errors: sessionEvents.filter((e: any) => e.event === 'error').length
    };
  }
}

export const analytics = new AnalyticsManager();

// React hook for analytics
export const useAnalytics = () => {
  const trackEvent = (event: string, category: string, label?: string, value?: number) => {
    analytics.track(event, category, label, value);
  };

  const trackPageView = (page: string) => {
    analytics.trackPageView(page);
  };

  const trackDownload = (resourceId: string, resourceName: string) => {
    analytics.trackDownload(resourceId, resourceName);
  };

  return {
    trackEvent,
    trackPageView,
    trackDownload,
    setUserId: analytics.setUserId.bind(analytics),
    getSessionStats: analytics.getSessionStats.bind(analytics)
  };
};