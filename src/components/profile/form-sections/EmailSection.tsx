
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';
import { useAuth } from '@/contexts/AuthContext';

interface EmailSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
}

export function EmailSection({ form }: EmailSectionProps) {
  const { user } = useAuth();
  const email = user?.email || form.getValues('email');

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input 
              value={email}
              disabled={true}
              className="bg-gray-50 text-gray-600"
            />
          </FormControl>
          <FormDescription>
            Email address cannot be changed
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
