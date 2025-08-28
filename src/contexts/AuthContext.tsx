import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { handleAsyncError } from '../utils/errorHandling';

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
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user data from database
          await fetchUserData(session.user.id);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        setError('Failed to check authentication status');
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await fetchUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        setError('User not found or inactive. Please contact administrator.');
        return;
      }

      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        name: data.name
      });
      setIsAuthenticated(true);
      setError(null);

      // Update last login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load user information');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // First, check if user exists in our users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single();

      if (userError) {
        console.error('User lookup error:', userError);
        setError('Invalid email or password');
        return false;
      }

      if (!userData) {
        setError('User not found or inactive');
        return false;
      }

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (authError) {
        console.error('Authentication error:', authError);
        setError('Invalid email or password');
        return false;
      }

      if (authData.user) {
        // Set user data directly from database
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          role: userData.role,
          name: userData.name
        });
        setIsAuthenticated(true);
        setError(null);

        // Update last login
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', userData.id);
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError('Logout failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};