
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { toast } from '@/hooks/use-toast';
import { 
  ensureUserProfileExists, 
  safeFetchProfile, 
  createDefaultUserProfile 
} from '@/utils/supabaseUtils';
import { asTypedParam, asUpdateParam } from '@/utils/supabaseTypeUtils';
import { useLocation as useLocationHook } from '@/hooks/useLocation';

interface AuthContextType {
  user: User | null;
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
  resetPassword: (token: string, password: string) => Promise<{ error: any }>;
  isNewUser: boolean;
  setIsNewUser: React.Dispatch<React.SetStateAction<boolean>>;
  updateProfile: (updates: { username: string; avatar_url: string; location: string; status: string; status_details: string; tagline: string }) => Promise<{ error: any }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
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
  const { getCurrentLocation } = useLocationHook();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          console.log("Auth state changed, event:", event);
          
          setSession(newSession);
          
          if (newSession?.user) {
            console.log("User logged in:", newSession.user.id);
            setUser(newSession.user);
            
            setTimeout(() => {
              refreshProfile(newSession.user);
            }, 0);
          } else {
            console.log("User logged out");
            setUser(null);
            setProfile(null);
          }
          setLoading(false);
        });

        const { data: { session: existingSession } } = await supabase.auth.getSession();

        if (existingSession) {
          setSession(existingSession);
          setUser(existingSession.user);
          await refreshProfile(existingSession.user);
          console.log("User session found and loaded:", existingSession.user.id);
        } else {
          console.log("No active session found");
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
          updated_at: null
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
        toast({
          title: "Account created!",
          description: "You have successfully signed up.",
        });
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
      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

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

  const updateProfile = async (updates: {
    username: string;
    avatar_url: string;
    location: string;
    status: string;
    status_details: string;
    tagline: string;
  }) => {
    try {
      if (!user) {
        throw new Error("No user is currently signed in.");
      }

      console.log("Attempting to update profile for user:", user.id);
      
      const { username, avatar_url, location, status, status_details, tagline } = updates;

      const profileUpdates = asUpdateParam<any>({
        username,
        avatar_url: avatar_url ? [avatar_url] : null, // Wrap in array to match DB structure or null
        location,
        status,
        status_details,
        tagline,
        updated_at: new Date().toISOString()
      });

      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', asTypedParam(user.id));

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
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

      setProfile((prevProfile) => ({
          ...prevProfile,
          username,
          avatar_url: avatar_url ? [avatar_url] : null, // Ensure it's updated as array or null
          location,
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
        .eq('id', asTypedParam(currentUser.id))
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        // Fallback to default profile on error
        setProfile(createDefaultUserProfile(currentUser.id, currentUser.email || ''));
        return;
      }

      if (profileData) {
        console.log("Profile data retrieved:", profileData);
        
        const userProfile = safeFetchProfile(profileData);
        if (userProfile) {
          // Check if location is missing but we can get it
          if (!userProfile.location) {
            try {
              const locationData = await getCurrentLocation();
              if (locationData) {
                // Update the profile with the location
                const { error: locUpdateError } = await supabase
                  .from('profiles')
                  .update({
                    location: locationData.location,
                    location_lat: locationData.latitude,
                    location_long: locationData.longitude
                  })
                  .eq('id', currentUser.id);
                
                if (!locUpdateError) {
                  userProfile.location = locationData.location;
                } else {
                  console.error("Error updating location:", locUpdateError);
                }
              }
            } catch (locErr) {
              console.error("Could not get user location:", locErr);
            }
          }
          
          setProfile(userProfile);
        } else {
          setProfile(createDefaultUserProfile(
            currentUser.id,
            currentUser.email || '',
            currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'User'
          ));
        }
      } else {
        console.log("No profile data found for user");
        setProfile(createDefaultUserProfile(
          currentUser.id,
          currentUser.email || '',
          currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'User'
        ));
      }
    } catch (error) {
      console.error("Unexpected error during profile refresh:", error);
      setProfile(createDefaultUserProfile(
        currentUser.id,
        currentUser.email || '',
        currentUser.email?.split('@')[0] || 'User'
      ));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
