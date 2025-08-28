import React, { 
  createContext, 
  useState, 
  useEffect, 
  useCallback, 
  ReactNode 
} from 'react';
import { databaseManager } from '../lib/database';

// Define the shape of the context's value
interface DatabaseContextType {
  databaseType: 'supabase';
  isConnected: boolean;
  connectionError: string | null;
  testConnection: () => Promise<void>;
}

// Export the context so the hook can use it from another file
export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// The provider component remains here
export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const testSupabaseConnection = useCallback(async () => {
    try {
      // Check for valid Supabase environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
        setIsConnected(false);
        setConnectionError('Supabase is not configured. Please set up your environment variables.');
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
      setConnectionError('Supabase connection failed. Check your configuration or network.');
      console.error('Supabase connection error:', error);
    }
  }, []); // useCallback with an empty dependency array

  // Run the connection test once on component mount
  useEffect(() => {
    testSupabaseConnection();
  }, [testSupabaseConnection]);

  return (
    <DatabaseContext.Provider value={{
      databaseType: 'supabase',
      isConnected,
      connectionError,
      testConnection: testSupabaseConnection // Use the memoized function
    }}>
      {children}
    </DatabaseContext.Provider>
  );
};