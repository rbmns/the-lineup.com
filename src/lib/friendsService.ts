
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';

// Function to get friendship status between two users
export const getFriendshipStatus = async (userId: string, friendId: string) => {
  try {
    console.log(`Checking friendship status between ${userId} and ${friendId}`);
    
    if (!userId || !friendId || userId === friendId) {
      console.log('Invalid user IDs provided');
      return 'none';
    }
    
    // Query for any friendship record between these users
    const { data, error } = await supabase
      .from('friendships')
      .select('status, user_id, friend_id')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (error) {
      console.error('Error checking friendship:', error);
      throw error;
    }
    
    console.log('Friendship data:', data);
    
    if (data && data.length > 0) {
      // Ensure case-insensitive comparison
      const status = data[0].status.toLowerCase();
      console.log('Found friendship status:', status);
      
      if (status === 'accepted') {
        return 'accepted';
      } else if (status === 'pending') {
        // Check if the current user is the requester or requestee
        if (data[0].user_id === userId) {
          return 'pending'; // User sent the request
        } else {
          return 'pending'; // Updated from 'requested' to 'pending' for consistency
        }
      }
    }
    
    console.log('No friendship found');
    return 'none';
  } catch (error) {
    console.error('Error checking friendship status:', error);
    return 'none'; // Return 'none' as a safe default
  }
};

// Function to send a friend request
export const sendFriendRequest = async (userId: string, friendId: string) => {
  try {
    if (!userId || !friendId || userId === friendId) {
      throw new Error('Invalid user or friend ID');
    }
    
    console.log(`Sending friend request from ${userId} to ${friendId}`);
    
    // Check if there's already a friendship
    const { data: existingFriendship, error: checkError } = await supabase
      .from('friendships')
      .select('*')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking existing friendship:', checkError);
      throw checkError;
    }
    
    // If friendship exists and is not removed, reject
    if (existingFriendship && existingFriendship.status !== 'Removed') {
      console.log('Friendship already exists:', existingFriendship);
      throw new Error('Friendship already exists');
    }
    
    // If friendship exists but is removed, update it
    if (existingFriendship && existingFriendship.status === 'Removed') {
      console.log('Updating removed friendship:', existingFriendship);
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Pending', 
          updated_at: new Date().toISOString() 
        })
        .eq('id', existingFriendship.id);
        
      if (updateError) {
        console.error('Error updating friendship:', updateError);
        throw updateError;
      }
      
      console.log('Friendship updated successfully');
      return 'updated';
    }
    
    // If no friendship exists, create new
    console.log('Creating new friendship');
    const { error: insertError } = await supabase
      .from('friendships')
      .insert({
        user_id: userId,
        friend_id: friendId,
        status: 'Pending'
      });
      
    if (insertError) {
      console.error('Error inserting friendship:', insertError);
      throw insertError;
    }
    
    console.log('Friend request sent successfully');
    return 'created';
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

// Function to get friend profiles by IDs
export const getFriendProfilesByIds = async (userIds: string[]): Promise<UserProfile[]> => {
  try {
    if (!userIds.length) return [];
    
    console.log('Fetching profiles for user IDs:', userIds);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', userIds);
      
    if (error) {
      console.error('Error fetching friend profiles:', error);
      throw error;
    }
    
    console.log(`Retrieved ${data?.length || 0} profiles`);
    return data as UserProfile[];
  } catch (error) {
    console.error('Error in getFriendProfilesByIds:', error);
    return [];
  }
};

// Function to remove a friendship between two users
export const removeFriendship = async (userId: string, friendId: string) => {
  try {
    if (!userId || !friendId || userId === friendId) {
      throw new Error('Invalid user or friend ID');
    }
    
    console.log(`Removing friendship between ${userId} and ${friendId}`);
    
    // Find the friendship record
    const { data, error: findError } = await supabase
      .from('friendships')
      .select('id')
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
      .eq('status', 'Accepted')
      .maybeSingle();
      
    if (findError) {
      console.error('Error finding friendship:', findError);
      throw findError;
    }
    
    if (!data) {
      console.error('Friendship not found');
      throw new Error('Friendship not found');
    }
    
    console.log(`Found friendship to remove: ${data.id}`);
    
    // Delete the friendship record
    const { error: deleteError } = await supabase
      .from('friendships')
      .delete()
      .eq('id', data.id);
      
    if (deleteError) {
      console.error('Error deleting friendship:', deleteError);
      throw deleteError;
    }
    
    console.log('Friendship removed successfully');
    return true;
  } catch (error) {
    console.error('Error removing friendship:', error);
    throw error;
  }
};
