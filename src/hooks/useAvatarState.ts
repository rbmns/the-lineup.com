
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
        setPreview(null);
        if (profile) {
          refreshProfile();
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [preview, profile, refreshProfile]);

  // Get avatar URL from profile
  const getAvatarUrl = () => {
    if (preview) return preview;
    if (!profile?.avatar_url) return null;
    
    const urls = processImageUrls(profile.avatar_url);
    return urls.length > 0 ? urls[0] : null;
  };

  return {
    preview,
    setPreview,
    getAvatarUrl
  };
};
