
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserProfile } from '@/types';
import { User } from '@supabase/supabase-js';

interface ProfileAccessControlProps {
  profile: UserProfile | null;
  user: User | null;
  userId?: string;
  loading: boolean;
  profileLoading: boolean;
  isAuthenticated: boolean;
  friendshipStatus: 'none' | 'pending' | 'accepted';
  children: React.ReactNode;
}

export const ProfileAccessControl: React.FC<ProfileAccessControlProps> = ({
  profile,
  user,
  userId,
  loading,
  profileLoading,
  isAuthenticated,
  friendshipStatus,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [accessChecked, setAccessChecked] = useState(false);
  const redirectTimeoutRef = useRef<number | null>(null);
  const accessCheckCompletedRef = useRef(false);

  // Improved logging for debugging
  useEffect(() => {
    console.log("ProfileAccessControl mounted/updated with:", {
      userId,
      currentUserId: user?.id,
      friendshipStatus,
      isAuthenticated,
      accessChecked,
      pathState: location.state
    });
  }, [userId, user?.id, friendshipStatus, isAuthenticated, accessChecked, location.state]);

  // Store the current URL in session storage to avoid unnecessary rechecks
  useEffect(() => {
    const currentPath = window.location.pathname;
    const lastCheckedPath = sessionStorage.getItem('lastCheckedProfilePath');
    
    if (currentPath !== lastCheckedPath) {
      // Reset the access check state for new paths
      setAccessChecked(false);
      sessionStorage.setItem('lastCheckedProfilePath', currentPath);
    }
    
    // Check for direct navigation sources
    const navigationState = sessionStorage.getItem('lastProfileNavigation');
    const referrer = document.referrer;
    const fromFriendsPage = referrer.includes('/friends') || 
                          (location.state && location.state.from === 'friends');
    const fromDirectNav = location.state && location.state.fromDirectNavigation;
    
    // Skip access check for direct navigation or if coming from friends page
    if ((navigationState || fromFriendsPage || fromDirectNav) && !accessChecked) {
      try {
        if (navigationState) {
          const parsed = JSON.parse(navigationState);
          if (parsed.userId === userId && parsed.fromDirectNavigation) {
            console.log("Direct navigation detected - skipping access check");
            // Clear the navigation state to prevent future false positives
            sessionStorage.removeItem('lastProfileNavigation');
            // Skip the access check for direct navigation
            setAccessChecked(true);
          }
        }
        
        if (fromFriendsPage) {
          console.log("Navigation from friends page detected - skipping access check");
          setAccessChecked(true);
        }
        
        if (fromDirectNav) {
          console.log("Direct navigation state detected - skipping access check");
          setAccessChecked(true);
        }
      } catch (e) {
        console.error("Failed to parse navigation state", e);
        sessionStorage.removeItem('lastProfileNavigation');
      }
    }
  }, [userId, location, accessChecked]);

  // Cleanup the timeout on unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // Main access check logic
  useEffect(() => {
    // Only run checks after authentication and profile loading are complete
    // and only if we haven't already checked access
    if (!loading && !profileLoading && !accessChecked && !accessCheckCompletedRef.current) {
      accessCheckCompletedRef.current = true;
      setAccessChecked(true);
      
      console.log("Running access check with:", {
        userId,
        currentUserId: user?.id,
        friendshipStatus,
        isAuthenticated
      });
      
      // Allow access to own profile
      if (userId === user?.id) {
        console.log("Access granted: Viewing own profile");
        return;
      }

      // Allow access to friends' profiles
      if (friendshipStatus === 'accepted') {
        console.log("Access granted: Viewing friend's profile with status 'accepted'");
        return;
      }

      // If we have a profile but user isn't a friend, redirect without showing a message
      if (profile && isAuthenticated && userId !== user?.id && 
          (friendshipStatus === 'none' || friendshipStatus === 'pending')) {
        
        console.log(`Access restricted. User ${userId} is not a friend of ${user?.id}. Friendship status: ${friendshipStatus}`);
        
        // Use a small delay before redirect to allow logging
        redirectTimeoutRef.current = window.setTimeout(() => {
          console.log("Redirecting to /friends page after access denied");
          navigate('/friends', { replace: true });
        }, 100);
      }
    }
  }, [userId, user?.id, friendshipStatus, loading, profileLoading, profile, navigate, isAuthenticated, accessChecked]);

  return <>{children}</>;
};
