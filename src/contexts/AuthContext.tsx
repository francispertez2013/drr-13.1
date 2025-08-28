import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /** Load extra profile data from the `users` table */
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('users')
        .select('id, username, email, role, name')
        .eq('id', userId)
        .eq('status', 'active')
        .maybeSingle(); // ✅ safe, returns null if not found

      if (fetchError) {
        console.error('Error fetching user data:', fetchError);
        setError('User not found or inactive. Please contact administrator.');
        return;
      }
      if (!data) {
        setError('User not found or inactive. Please contact administrator.');
        return;
      }

      setUser(data);
      setIsAuthenticated(true);
      setError(null);

      // Fire and forget last_login update
      supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId)
        .then();
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user information');
    }
  }, []);

  /** On mount, check if user already has a session */
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          await fetchUserData(session.user.id);
        }
      } catch (err) {
        console.error('Error checking user session:', err);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  /** Login flow: verify active user, then sign in */
  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        // Check if user exists & is active
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, username, email, role, name')
          .eq('email', email)
          .eq('status', 'active')
          .maybeSingle(); // ✅ avoid throw when no rows

        if (userError || !userData) {
          setError('Invalid email or password');
          return false;
        }

        // Supabase Auth sign in
        const { error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          console.error('Authentication error:', authError);
          setError('Invalid email or password');
          return false;
        }

        setUser(userData);
        setIsAuthenticated(true);
        setError(null);

        // Update last login
        supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userData.id)
          .then();

        return true;
      } catch (err) {
        console.error('Login error:', err);
        setError('Login failed. Please try again.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Logout user */
  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setError('Logout failed');
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}