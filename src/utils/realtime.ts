// Real-time utilities for production system

import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface RealtimeSubscription {
  channel: RealtimeChannel;
  unsubscribe: () => void;
}

export class RealtimeManager {
  private static subscriptions = new Map<string, RealtimeSubscription>();

  static subscribe(
    table: string,
    callback: (payload: any) => void,
    filter?: { column: string; value: any }
  ): RealtimeSubscription {
    const channelName = `${table}_${Date.now()}`;
    
    let channel = supabase.channel(channelName);
    
    if (filter) {
      channel = channel.on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table,
          filter: `${filter.column}=eq.${filter.value}`
        },
        callback
      );
    } else {
      channel = channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        callback
      );
    }
    
    channel.subscribe();

    const subscription: RealtimeSubscription = {
      channel,
      unsubscribe: () => {
        channel.unsubscribe();
        this.subscriptions.delete(channelName);
      }
    };

    this.subscriptions.set(channelName, subscription);
    return subscription;
  }

  static subscribeToMultipleTables(
    tables: string[],
    callback: (payload: any) => void
  ): RealtimeSubscription[] {
    return tables.map(table => this.subscribe(table, callback));
  }

  static unsubscribeAll(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }

  static getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }
}

// React hook for real-time subscriptions
export const useRealtime = (
  table: string,
  callback: (payload: any) => void,
  filter?: { column: string; value: any }
) => {
  React.useEffect(() => {
    const subscription = RealtimeManager.subscribe(table, callback, filter);
    
    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback, filter]);
};

export const realtime = RealtimeManager;