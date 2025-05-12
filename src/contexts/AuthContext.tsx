
import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/db';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, role: 'owner' | 'tenant') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true);

        if (session?.user) {
          const userData = session.user;
          const metadata = userData.user_metadata;
          
          // Map to our User type
          setUser({
            id: userData.id,
            email: userData.email || '',
            firstName: metadata?.first_name || '',
            lastName: metadata?.last_name || '',
            avatarUrl: metadata?.avatar_url,
            phoneNumber: metadata?.phone,
            role: metadata?.role || 'tenant',
            createdAt: userData.created_at || ''
          });
        } else {
          setUser(null);
        }

        setLoading(false);
      }
    );

    // Initialize user state
    const initializeUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const userData = session.user;
        const metadata = userData.user_metadata;
        
        setUser({
          id: userData.id,
          email: userData.email || '',
          firstName: metadata?.first_name || '',
          lastName: metadata?.last_name || '',
          avatarUrl: metadata?.avatar_url,
          phoneNumber: metadata?.phone,
          role: metadata?.role || 'tenant',
          createdAt: userData.created_at || ''
        });
      }
      
      setLoading(false);
    };

    initializeUser();

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in user
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have signed in successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An error occurred during sign in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const signUp = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string, 
    role: 'owner' | 'tenant'
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role
          }
        } 
      });
      
      if (error) throw error;
      
      toast({
        title: "Registration successful!",
        description: "Please check your email for verification.",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      toast({
        title: "Password reset email sent",
        description: "Please check your email for instructions.",
      });
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
