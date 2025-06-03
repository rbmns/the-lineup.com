
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';

interface UsernameSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
  showRequiredFields?: boolean;
  onEditUsername: () => void;
}

export function UsernameSection({ form, showRequiredFields, onEditUsername }: UsernameSectionProps) {
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
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={onEditUsername}
              className="flex gap-1 items-center"
            >
              <Edit size={16} /> Edit
            </Button>
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
