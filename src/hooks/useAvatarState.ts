
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { processImageUrls } from '@/utils/imageUtils';

export const useAvatarState = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const { profile, refreshProfile } = useAuth();
  
  // Reset preview after successful upload
  useEffect(() => {
    if (preview) {
      const timer = setTimeout(() => {
        console.log('Clearing preview and refreshing profile');
        setPreview(null);
        if (profile) {
          refreshProfile();
        }
      }, 2000); // Increased timeout to give database time to update
      
      return () => clearTimeout(timer);
    }
  }, [preview, profile, refreshProfile]);

  // Get avatar URL from profile - ensure we handle array format correctly
  const getAvatarUrl = () => {
    if (preview) {
      console.log('Using preview URL:', preview);
      return preview;
    }
    
    if (!profile?.avatar_url) {
      console.log('No avatar_url in profile');
      return null;
    }
    
    // Ensure we're working with arrays - this is critical for maintaining compatibility
    const urls = processImageUrls(profile.avatar_url);
    const avatarUrl = urls.length > 0 ? urls[0] : null;
    console.log('Processed avatar URLs:', urls, 'Using:', avatarUrl);
    return avatarUrl;
  };

  return {
    preview,
    setPreview,
    getAvatarUrl
  };
};
