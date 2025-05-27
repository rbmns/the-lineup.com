
import { supabase } from '@/integrations/supabase/client';

// Function to create a storage bucket if it doesn't exist
export const ensureBucketExists = async (bucketName: string, isPublic = true) => {
  try {
    console.log(`Checking if ${bucketName} bucket exists...`);
    
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    // Find if our bucket already exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      console.log(`Creating ${bucketName} bucket...`);
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
      });
      
      if (error) {
        console.error(`Error creating ${bucketName} bucket:`, error);
        return false;
      }
      
      console.log(`Created ${bucketName} bucket successfully`);
    } else {
      console.log(`${bucketName} bucket already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureBucketExists:', error);
    return false;
  }
};

// Function to ensure avatars bucket exists
export const ensureAvatarsBucketExists = async () => {
  return ensureBucketExists('avatars', true);
};

// Updated function to upload avatar image with better error handling
export const uploadAvatar = async (userId: string, file: File) => {
  try {
    console.log('Starting uploadAvatar function for user:', userId);
    
    // Ensure the avatars bucket exists
    const bucketReady = await ensureAvatarsBucketExists();
    if (!bucketReady) {
      throw new Error('Could not ensure avatars bucket exists');
    }
    
    // Create a consistent file name (no timestamp to allow overwriting)
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    
    console.log('Uploading file with name:', fileName);
    
    // Upload the file with upsert: true to replace existing
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
      
    if (error) {
      console.error('Storage upload error:', error);
      throw error;
    }
    
    console.log('File uploaded successfully:', data);
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
      
    console.log('Got public URL:', urlData.publicUrl);
    
    // Check if the profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }
    
    // Always use an array for avatar_url to match the database schema
    const avatarUrlArray = [urlData.publicUrl];
    console.log('Setting avatar_url array:', avatarUrlArray);
    
    // If no profile exists, create one
    if (!profileData) {
      console.log('No profile found, creating new one...');
      // Get user info from auth
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Error getting user:", userError);
        throw userError;
      }
      
      if (userData && userData.user) {
        // Create a new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email: userData.user.email,
            username: userData.user.email?.split('@')[0] || 'User',
            avatar_url: avatarUrlArray
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
        
        console.log("Created new profile with avatar URL:", avatarUrlArray);
        return urlData.publicUrl;
      }
    } else {
      console.log('Updating existing profile...');
      // Update profile with the new avatar URL array
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrlArray,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating avatar URL:", updateError);
        throw updateError;
      }
      
      console.log("Profile updated successfully with avatar URL:", avatarUrlArray);
    }
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};
