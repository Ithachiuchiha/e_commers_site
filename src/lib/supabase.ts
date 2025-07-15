import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid Supabase URL format');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: {
      getItem: (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.warn('localStorage getItem failed:', error);
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.warn('localStorage setItem failed:', error);
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn('localStorage removeItem failed:', error);
        }
      },
    },
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'jaya-farms'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enhanced session management utilities
export const sessionManager = {
  // Get current session with comprehensive error handling
  async getCurrentSession(retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.warn(`Session fetch error (attempt ${i + 1}):`, error);
          
          // If session is invalid, try to refresh
          if (error.message.includes('invalid') || error.message.includes('expired')) {
            const refreshResult = await this.refreshSession();
            if (refreshResult) return refreshResult;
          }
          
          if (i === retries - 1) throw error;
        } else {
          // Validate session integrity
          if (session?.access_token && session?.user) {
            return session;
          } else if (session) {
            console.warn('Session exists but missing required fields, attempting refresh');
            const refreshResult = await this.refreshSession();
            if (refreshResult) return refreshResult;
          }
        }
      } catch (error) {
        console.warn(`Session fetch attempt ${i + 1} failed:`, error);
        if (i === retries - 1) {
          // Last attempt failed, clear potentially corrupted session
          await this.clearAuthData();
          throw error;
        }
        // Wait before retry with exponential backoff
        await new Promise(resolve => setTimeout(resolve, 100 * Math.pow(2, i)));
      }
    }
    return null;
  },

  // Refresh session with validation
  async refreshSession() {
    try {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.warn('Session refresh failed:', error);
        // If refresh fails, clear corrupted session
        await this.clearAuthData();
        return null;
      }
      
      // Validate refreshed session
      if (session?.access_token && session?.user) {
        return session;
      } else {
        console.warn('Refreshed session is invalid, clearing auth data');
        await this.clearAuthData();
        return null;
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      await this.clearAuthData();
      return null;
    }
  },

  // Comprehensive auth data cleanup
  async clearAuthData() {
    try {
      // Sign out from Supabase first
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clear all auth-related localStorage keys
      const authKeys = Object.keys(localStorage).filter(key => 
        key.startsWith('sb-') || 
        key.includes('supabase') ||
        key.includes('auth-token') ||
        key.includes('access-token') ||
        key.includes('refresh-token')
      );
      authKeys.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          console.warn('Failed to remove localStorage key:', key, e);
        }
      });
      
      // Clear session storage as well
      try {
        const sessionKeys = Object.keys(sessionStorage).filter(key => 
          key.startsWith('sb-') || key.includes('supabase')
        );
        sessionKeys.forEach(key => sessionStorage.removeItem(key));
      } catch (e) {
        console.warn('Failed to clear sessionStorage:', e);
      }
      
      console.log('Auth data cleared successfully');
    } catch (error) {
      console.error('Error clearing auth data:', error);
      // Force clear localStorage even if signOut fails
      try {
        localStorage.clear();
      } catch (e) {
        console.warn('Failed to clear localStorage:', e);
      }
    }
  },

  // Validate current session integrity
  async validateSession() {
    try {
      const session = await this.getCurrentSession();
      if (!session) return false;
      
      // Test session by making a simple authenticated request
      const { error } = await supabase.auth.getUser();
      if (error) {
        console.warn('Session validation failed:', error);
        await this.clearAuthData();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      await this.clearAuthData();
      return false;
    }
  }
};

// Test database connection with retry logic
let connectionTested = false;

export const testConnection = async () => {
  if (connectionTested) return;
  
  try {
    const { error } = await supabase
      .from('products')
      .select('count')
      .limit(1)
      .single();

    if (error && !error.message.includes('No rows')) {
      throw error;
    }

    console.log('Supabase connection successful');
    connectionTested = true;
  } catch (error) {
    console.error('Supabase connection failed:', error);
    // Don't throw here to prevent app crashes
  }
};

// Initialize connection test
testConnection();