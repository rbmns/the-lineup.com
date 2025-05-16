
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

const AVATAR_BUCKET = 'avatars';
const EVENT_IMAGES_BUCKET = 'event-images';

export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(AVATAR_BUCKET)
      .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl // This should now be a string, not an array
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return avatarUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    toast.error('Failed to upload avatar');
    return null;
  }
};

export const uploadEventImage = async (
  eventId: string,
  file: File
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${eventId}/${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(EVENT_IMAGES_BUCKET)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from(EVENT_IMAGES_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading event image:', error);
    toast.error('Failed to upload event image');
    return null;
  }
};

export const updateUserAvatar = async (
  userId: string,
  avatarUrl: string
): Promise<boolean> => {
  try {
    // Update the user's profile with the new avatar URL
    const { error } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl // This should be a string, not an array
      })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error updating user avatar:', error);
    toast.error('Failed to update avatar');
    return false;
  }
};
