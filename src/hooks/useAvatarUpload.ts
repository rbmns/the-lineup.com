
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
      console.error('No user or profile found');
      toast({
        title: 'Not authenticated',
        description: 'You must be logged in to upload an avatar.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    console.log('Starting avatar upload for user:', user.id);
    console.log('File details:', { name: file.name, size: file.size, type: file.type });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = fileName;

      console.log('Uploading to path:', filePath);

      // Upload with upsert: true to replace existing files
      const { error: storageError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // This will replace existing files
        });

      if (storageError) {
        console.error('Storage upload error:', storageError);
        throw storageError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL of the image
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        console.error('Could not retrieve public URL');
        throw new Error('Could not retrieve public URL');
      }

      const url = urlData.publicUrl;
      console.log('Got public URL:', url);

      // Add timestamp for cache busting
      const cacheBustUrl = `${url}?t=${new Date().getTime()}`;
      console.log('Cache-busted URL:', cacheBustUrl);

      // Update user profile in the database - store as array
      const avatarUrlArray = [cacheBustUrl];
      console.log('Updating profile with avatar URL array:', avatarUrlArray);

      const { error: dbError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrlArray,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (dbError) {
        console.error('Database update error:', dbError);
        throw dbError;
      }

      console.log('Database updated successfully');

      // Refresh the profile to get updated data
      await refreshProfile();
      console.log('Profile refreshed');

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
      console.log('Upload process completed');
    }
  };

  return { uploadAvatar, uploading };
};
