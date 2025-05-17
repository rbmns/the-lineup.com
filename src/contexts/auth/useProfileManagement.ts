
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
import { useLocationHook } from '@/hooks/useLocation';

export const useProfileManagement = (
  user: User | null,
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>,
) => {
  const { getCurrentLocation } = useLocationHook();

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
          currentUser.email?.split('@')[0] || 'User'
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

  return {
    updateProfile,
    refreshProfile,
  };
};
