
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user, profile, refreshProfile } = useAuth();
  const { toast } = useToast();

  const uploadAvatar = async (file: File) => {
    if (!user || !profile) {
      toast({
        title: 'Not authenticated',
        description: 'You must be logged in to upload an avatar.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${Math.random().toString().substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('Uploading avatar with path:', filePath);

      // Upload the image to Supabase storage
      const { error: storageError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Storage error:', storageError);
        throw storageError;
      }

      // Get public URL of the image
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Could not retrieve public URL');
      }

      const url = urlData.publicUrl;
      console.log('Avatar URL:', url);

      // Add a timestamp to avoid caching issues
      const cacheBustUrl = `${url}?t=${new Date().getTime()}`;
      
      console.log('Updating profile with avatar URL array:', [cacheBustUrl]);

      // Update user profile in the database - ensure avatar_url is stored as array
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: [cacheBustUrl], // Always store as array
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Database update error:', dbError);
        throw dbError;
      }

      // Update local state and context
      await refreshProfile();

      toast({
        title: 'Avatar updated',
        description: 'Your avatar has been updated successfully.',
      });
      
      return cacheBustUrl;
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload avatar. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadAvatar, uploading };
};
