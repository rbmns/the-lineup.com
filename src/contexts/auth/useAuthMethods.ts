import { useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';
import { 
  ensureUserProfileExists, 
  safeFetchProfile, 
  createDefaultUserProfile 
} from '@/utils/supabaseUtils';
import { asTypedParam, asUpdateParam } from '@/utils/supabaseTypeUtils';
import { useLocation } from '@/hooks/useLocation';

export const useAuthMethods = (
  user: User | null,
  setUser: React.Dispatch<React.SetStateAction<User | null>>,
  profile: UserProfile | null,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>,
  setSession: React.Dispatch<React.SetStateAction<any>>,
) => {
  const { getCurrentLocation } = useLocation();

  const signUp = async (email: string, password: string, username: string) => {
    try {
      console.log("Attempting to sign up user with email:", email);
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error("Sign up error:", signUpError);
        toast({
          title: "Sign up failed",
          description: signUpError.message,
          variant: "destructive"
        });
        return { error: signUpError };
      }

      if (authData?.user) {
        console.log("Sign up successful, creating profile for user:", authData.user.id);
        
        // Get user's location
        let locationData = null;
        try {
          locationData = await getCurrentLocation();
        } catch (locErr) {
          console.error("Could not get user location:", locErr);
        }
        
        const newProfile: UserProfile = {
          id: authData.user.id,
          username: username || email.split('@')[0],
          email: email,
          avatar_url: null,
          location: locationData?.location || null,
          status: null,
          tagline: null,
          created_at: null,
          updated_at: null,
          location_category: null
        };
        
        await ensureUserProfileExists(authData.user.id, email, username || email.split('@')[0]);
        
        // If location was obtained, update the profile with location
        if (locationData) {
          const { error: locUpdateError } = await supabase
            .from('profiles')
            .update({
              location: locationData.location,
              location_lat: locationData.latitude,
              location_long: locationData.longitude
            })
            .eq('id', authData.user.id);
            
          if (locUpdateError) {
            console.error("Error updating location:", locUpdateError);
          }
        }
        
        setIsNewUser(true);
        return { error: null };
      }
      
      return { error: null };
    } catch (error) {
      console.error("Unexpected error during sign up:", error);
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in user with email:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error);
        toast({
          title: "Sign in failed",
          description: error.message || "Invalid login credentials. Please check your email and password.",
          variant: "destructive"
        });
        return { error, data: null };
      }

      console.log("Sign in successful:", data.user?.id);
      return { error: null, data };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting to sign out user");
      const { error } = await supabase.auth.signOut();
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
      const { error } = await supabase.auth.signInWithOtp({ email });

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
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
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
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            console.error("Forgot password error:", error);
            return { error };
        }

        return { error: null };
    } catch (error) {
        console.error("Unexpected error during forgot password request:", error);
        return { error };
    }
  };

  const resetPassword = async (token: string, password: string) => {
    try {
      console.log("Attempting to reset password");
      const { error } = await supabase.auth.updateUser({ 
        password 
      });
      
      if (error) {
        console.error("Reset password error:", error);
      }
      
      return { error };
    } catch (error) {
      console.error("Unexpected error during password reset:", error);
      return { error };
    }
  };

  return {
    signUp,
    signIn,
    signOut,
    logout,
    loginWithEmail,
    loginWithGoogle,
    forgotPassword,
    resetPassword,
  };
};
