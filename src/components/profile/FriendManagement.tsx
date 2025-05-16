
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { useFriendship } from '@/hooks/useFriendship';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types';
import { UserMinus } from 'lucide-react';

interface FriendManagementProps {
  profile: UserProfile | null;
  currentUserId: string | undefined;
  friendshipStatus: 'none' | 'pending' | 'accepted';
  setFriendshipStatus: (status: 'none' | 'pending' | 'accepted') => void;
  onFriendRemoved?: () => void;
  onUpdateFriendship?: (status: 'none' | 'pending' | 'accepted' | 'requested') => void;
  onBlock?: (blocked: boolean) => void;
  refreshProfile?: () => Promise<void>;
}

export const FriendManagement: React.FC<FriendManagementProps> = ({
  profile,
  currentUserId,
  friendshipStatus,
  setFriendshipStatus,
  onFriendRemoved,
  onUpdateFriendship,
  onBlock,
  refreshProfile
}) => {
  const [showUnfriendDialog, setShowUnfriendDialog] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const { initiateFriendRequest } = useFriendship(currentUserId);

  const handleAddFriend = async () => {
    if (!currentUserId || !profile?.id) {
      return;
    }

    try {
      setIsProcessing(true);
      const result = await initiateFriendRequest(profile.id);
      if (result) {
        setFriendshipStatus('pending');
        if (onUpdateFriendship) {
          onUpdateFriendship('pending');
        }
      }
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFriend = () => {
    setShowUnfriendDialog(true);
  };
  
  const confirmUnfriend = async () => {
    if (!currentUserId || !profile?.id) {
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await removeFriendship(currentUserId, profile.id);
      if (result) {
        setFriendshipStatus('none');
        
        if (onUpdateFriendship) {
          onUpdateFriendship('none');
        }
        
        if (onFriendRemoved) {
          onFriendRemoved();
        }
        
        if (refreshProfile) {
          await refreshProfile();
        }
      }
    } catch (error) {
      console.error('Error removing friend:', error);
    } finally {
      setIsProcessing(false);
      setShowUnfriendDialog(false);
    }
  };

  const removeFriendship = async (userId: string, friendId: string) => {
    try {
      console.log(`Attempting to remove friendship between ${userId} and ${friendId}`);
      
      // Find the friendship record
      const { data, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
        .eq('status', 'Accepted')
        .maybeSingle();
        
      if (findError) {
        console.error("Error finding friendship:", findError);
        throw findError;
      }
      
      if (!data) {
        console.error("Friendship not found");
        throw new Error('Friendship not found');
      }
      
      console.log(`Found friendship with ID: ${data.id}, updating to Removed`);
      
      // Update the friendship record to Removed status instead of deleting
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Removed',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
        
      if (updateError) {
        console.error("Error updating friendship:", updateError);
        throw updateError;
      }
      
      console.log("Friendship successfully marked as Removed");
      
      if (onBlock) {
        onBlock(false);
      }
      
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      throw error;
    }
  };

  const handleAcceptRequest = async () => {
    if (!currentUserId || !profile?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Find the friendship request
      const { data, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', profile.id)
        .eq('friend_id', currentUserId)
        .eq('status', 'Pending')
        .maybeSingle();
      
      if (findError) throw findError;
      if (!data) throw new Error('Friend request not found');
      
      // Update the status to Accepted
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      setFriendshipStatus('accepted');
      
      if (onUpdateFriendship) {
        onUpdateFriendship('accepted');
      }
      
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDeclineRequest = async () => {
    if (!currentUserId || !profile?.id) return;
    
    try {
      setIsProcessing(true);
      
      // Find the friendship request
      const { data, error: findError } = await supabase
        .from('friendships')
        .select('id')
        .eq('user_id', profile.id)
        .eq('friend_id', currentUserId)
        .eq('status', 'Pending')
        .maybeSingle();
      
      if (findError) throw findError;
      if (!data) throw new Error('Friend request not found');
      
      // Update the request to Removed status
      const { error: updateError } = await supabase
        .from('friendships')
        .update({ 
          status: 'Removed',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.id);
        
      if (updateError) throw updateError;
      
      setFriendshipStatus('none');
      
      if (onUpdateFriendship) {
        onUpdateFriendship('none');
      }
    } catch (err) {
      console.error('Error declining friend request:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {friendshipStatus === 'none' && (
        <Button 
          onClick={handleAddFriend} 
          className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Add Friend'}
        </Button>
      )}
      
      {friendshipStatus === 'pending' && (
        <Button 
          disabled 
          className="mt-4 bg-gray-400 text-white cursor-not-allowed"
        >
          Request Pending
        </Button>
      )}
      
      {friendshipStatus === 'accepted' && (
        <Button 
          onClick={handleRemoveFriend} 
          variant="outline" 
          className="mt-4 border-red-500 text-black hover:bg-red-50 bg-white"
          disabled={isProcessing}
        >
          <UserMinus className="h-4 w-4 mr-2" />
          {isProcessing ? 'Processing...' : 'Remove Friend'}
        </Button>
      )}
      
      <AlertDialog open={showUnfriendDialog} onOpenChange={setShowUnfriendDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {profile?.username || 'this user'} from your friends? 
              This will end your friendship connection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmUnfriend} 
              className="bg-white border border-red-500 text-black hover:bg-red-50"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
