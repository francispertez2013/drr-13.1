import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import { databaseManager } from '../lib/database';

interface DatabaseContextType {
  databaseType: 'supabase';
  isConnected: boolean;
  connectionError: string | null;
  testConnection: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
}

function DatabaseProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const testSupabaseConnection = useCallback(async () => {
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        setIsConnected(false);
        setConnectionError(
          'Supabase not configured. Please set up your environment variables.'
        );
        return;
      }

      const healthCheck = await databaseManager.healthCheck();
      if (healthCheck.status === 'healthy') {
        setIsConnected(true);
        setConnectionError(null);
      } else {
        setIsConnected(false);
        setConnectionError(healthCheck.message);
      }
    } catch (error) {
      console.error('Supabase connection error:', error);
      setIsConnected(false);
      setConnectionError(
        'Supabase connection failed. Please check your configuration.'
      );
    }
  }, []);

  useEffect(() => {
    testSupabaseConnection();
  }, [testSupabaseConnection]);

  return (
    <DatabaseContext.Provider
      value={{
        databaseType: 'supabase',
        isConnected,
        connectionError,
        testConnection: testSupabaseConnection,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
}

export { DatabaseProvider, useDatabase };