
import { supabase } from '@/integrations/supabase/client';

// Function to create a storage bucket if it doesn't exist
export const ensureBucketExists = async (bucketName: string, isPublic = true) => {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return false;
    }
    
    // Find if our bucket already exists
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      // Create the bucket
      const { error } = await supabase.storage.createBucket(bucketName, {
        public: isPublic,
        fileSizeLimit: 10 * 1024 * 1024 // 10MB limit
      });
      
      if (error) {
        console.error(`Error creating ${bucketName} bucket:`, error);
        return false;
      }
      
      console.log(`Created ${bucketName} bucket`);
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

// Function to upload avatar image
export const uploadAvatar = async (userId: string, file: File) => {
  try {
    // Ensure the avatars bucket exists
    const bucketReady = await ensureAvatarsBucketExists();
    if (!bucketReady) {
      throw new Error('Could not ensure avatars bucket exists');
    }
    
    // Create a unique file name with timestamp
    const timestamp = new Date().getTime();
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExt}`;
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type
      });
      
    if (error) {
      throw error;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
      
    // Check if the profile exists
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, avatar_url')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError && !profileError.message.includes('No rows found')) {
      console.error("Error fetching profile:", profileError);
      throw profileError;
    }
    
    // Always use a single-item array with just the new URL - this replaces any existing avatar
    const avatarUrls = [urlData.publicUrl];
    
    // If no profile exists, create one
    if (!profileData) {
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
            avatar_url: avatarUrls
          });
          
        if (insertError) {
          console.error("Error creating profile:", insertError);
          throw insertError;
        }
        
        console.log("Created new profile with avatar URL:", avatarUrls);
        return avatarUrls;
      }
    } else {
      // Update profile with the new avatar URL array (replacing the old one)
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrls 
        })
        .eq('id', userId);
        
      if (updateError) {
        console.error("Error updating avatar URL:", updateError);
        throw updateError;
      }
    }
    
    console.log("Avatar URL updated successfully to:", avatarUrls);
    return avatarUrls;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};
