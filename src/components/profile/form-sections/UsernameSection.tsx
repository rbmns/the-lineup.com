
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';
import { UsernameEditDialog } from '../UsernameEditDialog';
import { useAuth } from '@/contexts/AuthContext';

interface UsernameSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
  showRequiredFields?: boolean;
}

export function UsernameSection({ form, showRequiredFields }: UsernameSectionProps) {
  const { user, profile, refreshProfile } = useAuth();

  const handleUsernameUpdate = async (newUsername: string) => {
    // Update the form value
    form.setValue('username', newUsername);
    
    // Refresh the profile to get the latest data
    if (refreshProfile) {
      await refreshProfile();
    }
  };

  if (!user || !profile) {
    return null;
  }

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
              <Input {...field} disabled className="bg-gray-50" />
            </FormControl>
            <UsernameEditDialog
              currentUsername={profile.username || ''}
              userId={user.id}
              onUsernameUpdate={handleUsernameUpdate}
            />
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
