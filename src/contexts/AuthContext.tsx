
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';
import { ensureUserProfileExists, safeFetchProfile, createDefaultUserProfile } from '@/utils/supabaseUtils';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
  loginWithEmail: (email: string) => Promise<{ error: any }>;
  loginWithGoogle: () => Promise<{ error: any }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ error: any }>;
  resetPassword: (password: string) => Promise<{ error: any }>;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfile: (updates: { username: string; avatar_url: string; location: string; location_category: string; status: string; status_details: string; tagline: string }) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null, data: null }),
  signOut: async () => {},
  loginWithEmail: async () => ({ error: null }),
  loginWithGoogle: async () => ({ error: null }),
  logout: async () => {},
  forgotPassword: async () => ({ error: null }),
  resetPassword: async () => ({ error: null }),
  isNewUser: false,
  setIsNewUser: () => {},
  updateProfile: async () => ({ error: null }),
  refreshProfile: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null); 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed, event:", event, "user:", newSession?.user?.id);
          
          setSession(newSession);
          
          if (newSession?.user) {
            console.log("User logged in:", newSession.user.id);
            setUser(newSession.user);
            
            // Defer profile operations to prevent auth state conflicts
            setTimeout(() => {
              refreshProfile(newSession.user);
            }, 100);
          } else {
            console.log("User logged out");
            setUser(null);
            setProfile(null);
            setSession(null);
          }
          setLoading(false);
        });

        const { data: { session: existingSession } } = await supabase.auth.getSession();

        if (existingSession) {
          console.log("Existing session found:", existingSession.user.id);
          setSession(existingSession);
          setUser(existingSession.user);
          await refreshProfile(existingSession.user);
        } else {
          console.log("No active session found");
          setUser(null);
          setProfile(null);
          setSession(null);
        }

        setLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Error during auth initialization:", error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log("Attempting to sign up user with email:", email);
      
      // Clean up any existing auth state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        // Ignore cleanup errors
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Get current domain for redirect URL
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/`;
      
      console.log("Using redirect URL:", redirectUrl);
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          },
          emailRedirectTo: redirectUrl
        }
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        
        // Handle specific error cases
        if (signUpError.message.includes('User already registered')) {
          return { 
            error: { 
              message: "This email is already registered. Please try logging in instead or use a different email address." 
            }
          };
        }
        
        return { error: signUpError };
      }

      if (authData?.user) {
        console.log("Sign up successful for user:", authData.user.id);
        setIsNewUser(true);
        
        // For immediate login (if email confirmation is disabled)
        if (authData.session) {
          console.log("User immediately logged in after signup");
          setSession(authData.session);
          setUser(authData.user);
          
          // Try to ensure profile exists
          try {
            await ensureUserProfileExists(
              authData.user.id, 
              email, 
              username || email.split('@')[0]
            );
            await refreshProfile(authData.user);
          } catch (profileError) {
            console.warn("Profile creation failed, but signup succeeded:", profileError);
          }
        } else {
          // Email confirmation required
          console.log("Email confirmation required for user:", authData.user.id);
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link. Please check your email and click the link to activate your account.",
          });
        }
        
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user with email:", email);
      
      // Clean up existing state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (e) {
        // Ignore cleanup errors
      }
      
      setUser(null);
      setProfile(null);
      setSession(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        
        // Handle specific error cases
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials and try again.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        }
        
        return { error: { ...error, message: errorMessage }, data: null };
      }

      console.log("Sign in successful:", data.user?.id);
      
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        await refreshProfile(data.user);
      }

      return { error: null, data };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out user");
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error("Sign out error:", error);
        toast({
          title: "Sign out failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        console.log("User signed out successfully");
        toast({
          title: "Signed out",
          description: "You have been logged out successfully.",
        });
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast({
        title: "Sign out failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
  };

  const logout = async () => {
    return await signOut();
  };

  const loginWithEmail = async (email: string) => {
    try {
      console.log("Attempting magic link login with email:", email);
      
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/`;
      
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (error) {
        console.error("Magic link login error:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected error during magic link login:", error);
      return { error };
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log("Attempting Google login");
      
      const currentDomain = window.location.origin;
      const redirectUrl = `${currentDomain}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error("Google login error:", error);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error("Unexpected error during Google login:", error);
      return { error };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
        console.log("Attempting to send forgot password email to:", email);
        
        // Clean up any existing sessions
        try {
          await supabase.auth.signOut({ scope: 'global' });
        } catch (e) {
          // Ignore cleanup errors
        }
        
        const currentDomain = window.location.origin;
        const redirectUrl = `${currentDomain}/reset-password`;
        
        console.log("Reset password redirect URL:", redirectUrl);
        
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: redirectUrl,
        });

        if (error) {
            console.error("Forgot password error:", error);
            return { error };
        }

        console.log("Password reset email sent successfully");
        return { error: null };
    } catch (error) {
        console.error("Unexpected error during forgot password request:", error);
        return { error };
    }
  };

  const resetPassword = async (password: string) => {
    try {
      console.log("Attempting to reset password");
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) {
        console.error("Reset password error:", error);
      } else {
        console.log("Password reset successful");
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      return { error };
    }
  };

  const updateProfile = async (updates: {
    username: string;
    avatar_url: string;
    location: string;
    location_category: string;
    status: string;
    status_details: string;
    tagline: string;
  }) => {
    try {
      if (!user) {
        throw new Error("No user is currently signed in.");
      }

      console.log("Attempting to update profile for user:", user.id);
      
      const { username, avatar_url, location, location_category, status, status_details, tagline } = updates;

      const profileUpdates = {
          id: user.id,
          username,
          avatar_url: [avatar_url],
          location,
          location_category,
          status,
          status_details,
          tagline,
          updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
          .from('profiles')
          .upsert(profileUpdates as any);

      if (error) {
          console.error("Error updating profile:", error);
          toast({
            title: "Profile update failed",
            description: error.message,
            variant: "destructive"
          });
          return { error };
      }

      console.log("Profile updated successfully");
      
      setProfile((prevProfile) => ({
          ...prevProfile,
          username,
          avatar_url: [avatar_url],
          location,
          location_category,
          status,
          status_details,
          tagline,
          updated_at: new Date().toISOString(),
      } as UserProfile));

      return { error: null };
    } catch (error) {
      console.error("Unexpected error during profile update:", error);
      toast({
        title: "Profile update failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const refreshProfile = async (currentUser: User | null = user) => {
    if (!currentUser) {
      console.warn("No user to refresh profile for.");
      return;
    }

    try {
      console.log("Refreshing profile for user:", currentUser.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id as any)
        .maybeSingle();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        
        // Try to create profile if fetch fails
        if (currentUser.email) {
          try {
            console.log("Attempting to create profile for user:", currentUser.id);
            await ensureUserProfileExists(
              currentUser.id, 
              currentUser.email, 
              currentUser.user_metadata?.username || currentUser.email.split('@')[0]
            );
            
            // Retry fetching the profile
            const { data: retryData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentUser.id as any)
              .maybeSingle();
              
            if (retryData) {
              console.log("Profile created and fetched successfully");
              const userProfile = safeFetchProfile(retryData);
              if (userProfile) {
                setProfile(userProfile);
              }
              return;
            }
          } catch (createError) {
            console.error("Failed to create profile:", createError);
          }
        }
        
        // Fallback to default profile
        setProfile(createDefaultUserProfile(
          currentUser.id,
          currentUser.email || '',
          currentUser.email?.split('@')[0] || 'User'
        ));
        return;
      }

      if (profileData) {
        console.log("Profile data retrieved:", profileData);
        
        const userProfile = safeFetchProfile(profileData);
        if (userProfile) {
          setProfile(userProfile);
        } else {
          setProfile(createDefaultUserProfile(
            currentUser.id,
            currentUser.email || '',
            currentUser.email?.split('@')[0] || 'User'
          ));
        }
      } else {
        console.log("No profile data found for user, creating default");
        setProfile(createDefaultUserProfile(
          currentUser.id,
          currentUser.email || '',
          currentUser.email?.split('@')[0] || 'User'
        ));
      }
    } catch (error) {
      console.error("Unexpected error during profile refresh:", error);
      if (currentUser) {
        setProfile(createDefaultUserProfile(
          currentUser.id,
          currentUser.email || '',
          currentUser.email?.split('@')[0] || 'User'
        ));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        isNewUser,
        setIsNewUser,
        signUp,
        signIn,
        updateProfile,
        refreshProfile,
        signOut,
        loginWithEmail,
        loginWithGoogle,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
