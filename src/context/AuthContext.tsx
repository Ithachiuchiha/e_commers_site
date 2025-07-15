import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, sessionManager } from '../lib/supabase';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  default_shipping_address: any | null;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  signUp: (email: string, password: string, profile: { name: string; phone: string; address: string }) => Promise<{ success: boolean; error: string | null }>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isAdmin: boolean;
  isSessionReady: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSessionReady, setIsSessionReady] = useState(false);

  const isAdmin = profile?.role === 'admin';

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) {
      console.warn('No userId provided to fetchProfile');
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return;
      }

      if (!data) {
        console.warn('No profile found for user:', userId);
        setProfile(null);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setProfile(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  }, [user?.id, fetchProfile]);

  // Save cart data to backend before clearing session
  const saveCartToBackend = useCallback(async (userId: string) => {
    try {
      const cartData = localStorage.getItem('cart-data');
      if (cartData && userId) {
        const { error } = await supabase
          .from('user_sessions')
          .upsert({
            user_id: userId,
            cart_data: JSON.parse(cartData),
            last_activity: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          });

        if (error) {
          console.warn('Failed to save cart data:', error);
        } else {
          console.log('Cart data saved to backend');
        }
      }
    } catch (error) {
      console.warn('Error saving cart data:', error);
    }
  }, []);

  // Load cart data from backend after login
  const loadCartFromBackend = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('cart_data')
        .eq('user_id', userId)
        .maybeSingle();

      if (!error && data?.cart_data) {
        localStorage.setItem('cart-data', JSON.stringify(data.cart_data));
        console.log('Cart data restored from backend');
        
        // Dispatch custom event to notify cart context
        window.dispatchEvent(new CustomEvent('cart-restored', { 
          detail: data.cart_data 
        }));
      }
    } catch (error) {
      console.warn('Error loading cart data:', error);
    }
  }, []);

  // Clear session on page refresh/load
  const clearSessionOnRefresh = useCallback(async () => {
    try {
      // Check if this is a page refresh (not initial load)
      const wasLoggedIn = sessionStorage.getItem('was-logged-in');
      const currentSession = await sessionManager.getCurrentSession();
      
      if (wasLoggedIn && currentSession?.user) {
        console.log('Page refresh detected, saving cart and clearing session');
        
        // Save cart data before clearing
        await saveCartToBackend(currentSession.user.id);
        
        // Clear the session
        await sessionManager.clearAuthData();
        
        // Clear the refresh indicator
        sessionStorage.removeItem('was-logged-in');
        
        // Clear local state
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error during session refresh cleanup:', error);
    }
  }, [saveCartToBackend]);

  // Initialize auth state
  const initializeAuth = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Initializing auth state...');
      
      // Clear session on refresh first
      await clearSessionOnRefresh();
      
      // Check for valid session
      const isValid = await sessionManager.validateSession();
      if (!isValid) {
        console.log('No valid session found');
        setSession(null);
        setUser(null);
        setProfile(null);
        setIsSessionReady(true);
        setLoading(false);
        return;
      }
      
      const currentSession = await sessionManager.getCurrentSession();
      
      if (currentSession?.user) {
        console.log('Valid session found, setting auth state');
        setSession(currentSession);
        setUser(currentSession.user);
        await fetchProfile(currentSession.user.id);
        
        // Mark as logged in for refresh detection
        sessionStorage.setItem('was-logged-in', 'true');
        
        // Load cart data from backend
        await loadCartFromBackend(currentSession.user.id);
      } else {
        console.log('No session found after validation');
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await sessionManager.clearAuthData();
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
      setIsSessionReady(true);
    }
  }, [fetchProfile, clearSessionOnRefresh, loadCartFromBackend]);

  useEffect(() => {
    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state change:', event, newSession?.user?.id);
      
      try {
        if (event === 'SIGNED_OUT' || !newSession?.user) {
          console.log('User signed out or session invalid');
          sessionStorage.removeItem('was-logged-in');
          setSession(null);
          setUser(null);
          setProfile(null);
        } else if (event === 'SIGNED_IN') {
          console.log('User signed in');
          
          if (newSession?.access_token && newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            await fetchProfile(newSession.user.id);
            
            // Mark as logged in for refresh detection
            sessionStorage.setItem('was-logged-in', 'true');
            
            // Load cart data from backend
            await loadCartFromBackend(newSession.user.id);
          } else {
            console.warn('Invalid session received, clearing auth state');
            await sessionManager.clearAuthData();
            setSession(null);
            setUser(null);
            setProfile(null);
          }
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
          if (newSession?.access_token && newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
          }
        }
      } catch (error) {
        console.error('Error handling auth state change:', error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
        setIsSessionReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [initializeAuth, fetchProfile, loadCartFromBackend]);

  const signUp = async (
    email: string,
    password: string,
    profileData: { name: string; phone: string; address: string }
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      setLoading(true);
      
      const { data: { user: newUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          return { success: false, error: 'This email is already registered.' };
        }
        return { success: false, error: signUpError.message || 'Failed to create user' };
      }

      if (!newUser) {
        return { success: false, error: 'Failed to create user' };
      }

      const nameParts = profileData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const shippingAddress = {
        street: profileData.address,
        city: '',
        state: '',
        postal_code: '',
        country: ''
      };

      const { error: profileError } = await supabase
        .from('customers')
        .insert([
          {
            id: newUser.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: profileData.phone,
            default_shipping_address: shippingAddress,
            role: 'customer',
          },
        ]);

      if (profileError) {
        return { success: false, error: profileError.message || 'Failed to create profile' };
      }

      return { success: true, error: null };
    } catch (error: any) {
      console.error('Error during sign up:', error);
      return { success: false, error: error.message || 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      await sessionManager.clearAuthData();
      
      const { data: { session: newSession }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (newSession?.user && newSession?.access_token) {
        console.log('Sign in successful, setting auth state');
        setSession(newSession);
        setUser(newSession.user);
        await fetchProfile(newSession.user.id);
        
        // Mark as logged in for refresh detection
        sessionStorage.setItem('was-logged-in', 'true');
        
        // Load cart data from backend
        await loadCartFromBackend(newSession.user.id);
      } else {
        throw new Error('Invalid session received after sign in');
      }
    } catch (error) {
      console.error('Error during sign in:', error);
      await sessionManager.clearAuthData();
      setSession(null);
      setUser(null);
      setProfile(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out...');
      
      // Save cart data before signing out
      if (user?.id) {
        await saveCartToBackend(user.id);
      }
      
      // Clear session storage
      sessionStorage.removeItem('was-logged-in');
      
      // Clear cart data from localStorage
      localStorage.removeItem('cart-data');
      
      // Dispatch event to clear cart in context
      window.dispatchEvent(new CustomEvent('cart-cleared'));
      
      // Force clear auth data
      await sessionManager.clearAuthData();
      
      // Clear local state immediately
      setSession(null);
      setUser(null);
      setProfile(null);
      
      console.log('Sign out completed');
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if signOut fails, clear local state
      sessionStorage.removeItem('was-logged-in');
      localStorage.removeItem('cart-data');
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      signUp,
      signIn,
      signOut,
      loading,
      isAdmin,
      isSessionReady,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};