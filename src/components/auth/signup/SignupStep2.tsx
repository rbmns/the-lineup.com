
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignupFormValues } from '@/hooks/useSignupForm';

interface SignupStep2Props {
  loading: boolean;
  blurredFields: Record<string, boolean>;
  handleFieldBlur: (fieldName: string) => void;
}

export const SignupStep2: React.FC<SignupStep2Props> = ({ loading, blurredFields, handleFieldBlur }) => {
  const form = useFormContext<SignupFormValues>();

  return (
    <>
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password"
                disabled={loading} 
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('password');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.password && <FormMessage />}
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password" 
                disabled={loading} 
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('confirmPassword');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.confirmPassword && <FormMessage />}
          </FormItem>
        )}
      />
    </>
  );
};
