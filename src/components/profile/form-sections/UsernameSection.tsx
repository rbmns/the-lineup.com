
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit, Check, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface UsernameSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
  showRequiredFields?: boolean;
  onEditUsername?: () => void;
}

export function UsernameSection({ form, showRequiredFields, onEditUsername }: UsernameSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [tempUsername, setTempUsername] = useState(form.getValues('username'));
  const { toast } = useToast();

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    if (!username || username.length < 2) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, username is available
        return true;
      }
      
      if (data) {
        // Username exists
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const handleEditClick = () => {
    setTempUsername(form.getValues('username'));
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!tempUsername || tempUsername.length < 2) {
      toast({
        title: 'Invalid username',
        description: 'Username must be at least 2 characters long.',
        variant: 'destructive',
      });
      return;
    }

    if (tempUsername === form.getValues('username')) {
      setIsEditing(false);
      return;
    }

    setIsChecking(true);
    
    try {
      const isAvailable = await checkUsernameAvailability(tempUsername);
      
      if (!isAvailable) {
        toast({
          title: 'Username taken',
          description: 'This username is already taken. Please choose another one.',
          variant: 'destructive',
        });
        setIsChecking(false);
        return;
      }

      // Update the form value
      form.setValue('username', tempUsername);
      setIsEditing(false);
      
      toast({
        title: 'Username updated',
        description: 'Your username has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating username:', error);
      toast({
        title: 'Error',
        description: 'Failed to update username. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleCancel = () => {
    setTempUsername(form.getValues('username'));
    setIsEditing(false);
  };

  return (
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {showRequiredFields && <span className="text-red-500 mr-1">*</span>}
            Username
          </FormLabel>
          <div className="flex gap-2 items-center">
            <FormControl>
              {isEditing ? (
                <Input
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  disabled={isChecking}
                  className="flex-1"
                  placeholder="Enter username"
                />
              ) : (
                <Input {...field} disabled className="bg-gray-50 flex-1" />
              )}
            </FormControl>
            
            {isEditing ? (
              <div className="flex gap-1">
                <Button 
                  type="button" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={isChecking}
                  className="flex gap-1 items-center"
                >
                  <Check size={16} />
                  {isChecking ? 'Checking...' : 'Save'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm" 
                  onClick={handleCancel}
                  disabled={isChecking}
                  className="flex gap-1 items-center"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleEditClick}
                className="flex gap-1 items-center"
              >
                <Edit size={16} /> Edit
              </Button>
            )}
          </div>
          <FormDescription>
            This is your public display name.
            {showRequiredFields && " This field is required."}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
