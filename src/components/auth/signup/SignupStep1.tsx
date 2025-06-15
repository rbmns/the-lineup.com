
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignupFormValues } from '@/hooks/useSignupForm';

interface SignupStep1Props {
  loading: boolean;
}

export const SignupStep1: React.FC<SignupStep1Props> = ({ loading }) => {
  const form = useFormContext<SignupFormValues>();

  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input 
              placeholder="name@example.com" 
              type="email" 
              autoComplete="email" 
              disabled={loading} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
