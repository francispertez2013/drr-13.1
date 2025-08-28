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
  register: (userData: { email: string; password: string; name: string; username: string; role?: 'admin' | 'editor' }) => Promise<boolean>;
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
        // If user record doesn't exist, create one for the authenticated user
        if (error.code === 'PGRST116') {
          console.log('User record not found, creating new user record...');
          await createUserRecord(userId);
          return;
        }
        
        console.error('Error fetching user data:', error);
        setError('User not found or inactive');
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

  const createUserRecord = async (userId: string) => {
    try {
      // Get user info from Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.getUser();
      
      if (authError || !authUser.user) {
        throw new Error('Could not get authenticated user info');
      }

      const email = authUser.user.email;
      if (!email) {
        throw new Error('User email not available');
      }

      // Create username from email
      const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      
      // Extract name from email or use default
      const name = authUser.user.user_metadata?.name || 
                   authUser.user.user_metadata?.full_name || 
                   email.split('@')[0];

      // Create user record in database
      const { data, error } = await supabase
        .from('users')
        .insert([{
          id: userId,
          username: username,
          email: email,
          name: name,
          role: 'admin', // Default to admin for first user, can be changed later
          status: 'active',
          password_hash: 'managed_by_supabase_auth'
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user record:', error);
        setError('Failed to create user profile');
        return;
      }

      // Set user data
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
        name: data.name
      });
      setIsAuthenticated(true);
      setError(null);

      console.log('User record created successfully');
    } catch (error) {
      console.error('Error creating user record:', error);
      setError('Failed to create user profile');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        return false;
      }

      if (data.user) {
        await fetchUserData(data.user.id);
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

  const register = async (userData: { 
    email: string; 
    password: string; 
    name: string; 
    username: string; 
    role?: 'admin' | 'editor' 
  }): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.username)
        .single();

      if (existingUser) {
        setError('Username already exists');
        return false;
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password
      });

      if (authError) {
        console.error('Auth registration error:', authError);
        setError(authError.message);
        return false;
      }

      if (!authData.user) {
        setError('Failed to create user account');
        return false;
      }

      // Create user record in database
      const { error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          username: userData.username,
          email: userData.email,
          name: userData.name,
          role: userData.role || 'editor',
          status: 'active',
          password_hash: 'managed_by_supabase_auth' // Placeholder since Supabase handles auth
        }]);

      if (dbError) {
        console.error('Database user creation error:', dbError);
        setError('Failed to create user profile');
        
        // Clean up auth user if database insert fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};