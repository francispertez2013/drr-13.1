import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { databaseManager } from '../lib/database';

interface DatabaseContextType {
  databaseType: 'supabase';
  isConnected: boolean;
  connectionError: string | null;
  testConnection: () => Promise<void>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    testSupabaseConnection();
  }, []);

  const testSupabaseConnection = async () => {
    try {
      // Check if Supabase is properly configured
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        setIsConnected(false);
        setConnectionError('Supabase not configured. Please set up your environment variables.');
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
      setIsConnected(false);
      setConnectionError('Supabase connection failed. Please check your configuration.');
      console.error('Supabase connection error:', error);
    }
  };

  const testConnection = async () => {
    await testSupabaseConnection();
  };

  return (
    <DatabaseContext.Provider value={{
      databaseType: 'supabase',
      isConnected,
      connectionError,
      testConnection
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};