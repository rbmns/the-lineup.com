
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UsernameEditDialogProps {
  currentUsername: string;
  userId: string;
  onUsernameUpdate: (newUsername: string) => void;
}

export const UsernameEditDialog: React.FC<UsernameEditDialogProps> = ({
  currentUsername,
  userId,
  onUsernameUpdate
}) => {
  const [open, setOpen] = useState(false);
  const [newUsername, setNewUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const validateUsername = (username: string): string | null => {
    if (!username.trim()) {
      return 'Username is required';
    }
    if (username.length < 2) {
      return 'Username must be at least 2 characters';
    }
    if (username.length > 30) {
      return 'Username must not exceed 30 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return 'Username can only contain letters, numbers, underscores, and hyphens';
    }
    return null;
  };

  const checkUsernameUniqueness = async (username: string): Promise<boolean> => {
    if (username === currentUsername) {
      return true; // Same username is allowed
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found, username is available
      return true;
    }

    return !data; // If data exists, username is taken
  };

  const handleSave = async () => {
    setError('');
    setIsLoading(true);

    try {
      // Validate username format
      const validationError = validateUsername(newUsername);
      if (validationError) {
        setError(validationError);
        setIsLoading(false);
        return;
      }

      // Check uniqueness
      const isUnique = await checkUsernameUniqueness(newUsername);
      if (!isUnique) {
        setError('This username is already taken');
        setIsLoading(false);
        return;
      }

      // Update username in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }

      onUsernameUpdate(newUsername);
      toast({
        title: 'Username updated',
        description: 'Your username has been successfully updated.',
      });
      setOpen(false);
    } catch (err: any) {
      console.error('Error updating username:', err);
      setError(err.message || 'Failed to update username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewUsername(currentUsername);
    setError('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          className="flex gap-1 items-center"
        >
          <Edit size={16} /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 text-black shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-black">Edit Username</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-black">Username</Label>
            <Input
              id="username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Enter new username"
              disabled={isLoading}
              className="bg-white border-gray-300 text-black"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-white border-gray-300 text-black hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading || newUsername === currentUsername}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
