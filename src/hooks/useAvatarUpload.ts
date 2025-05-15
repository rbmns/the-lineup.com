
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { asTypedParam, asInsertParam } from '@/utils/supabaseTypeUtils';

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
      
      // Ensure avatar_url is treated as an array
      const currentAvatarUrls = Array.isArray(profile.avatar_url) 
        ? profile.avatar_url || [] 
        : profile.avatar_url ? [profile.avatar_url] : [];

      console.log('Current avatar URLs:', currentAvatarUrls);

      // Update user profile in the database using type-safe parameters
      const updates = asInsertParam<any>({
        id: user.id,
        avatar_url: [cacheBustUrl], // Replace with new avatar rather than append
        updated_at: new Date().toISOString(),
      });

      console.log('Updating profile with:', updates);

      const { error: dbError } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'id',
        });

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
