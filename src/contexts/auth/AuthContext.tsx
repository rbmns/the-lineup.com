
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { defaultAuthContext } from './defaultContext';
import { AuthContextType } from './types';
import { useAuthMethods } from './useAuthMethods';
import { useProfileManagement } from './useProfileManagement';

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  const authMethods = useAuthMethods(user, setUser, profile, setProfile, setIsNewUser, setSession);
  const profileMethods = useProfileManagement(user, setProfile);

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
              profileMethods.refreshProfile(newSession.user);
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
          await profileMethods.refreshProfile(existingSession.user);
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isNewUser,
        setIsNewUser,
        ...authMethods,
        ...profileMethods,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
