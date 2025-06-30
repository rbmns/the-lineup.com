
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
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-graphite-grey">
              Password
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password"
                disabled={loading}
                className="h-10"
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('password');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.password && <FormMessage className="text-sm text-red-500" />}
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium text-graphite-grey">
              Confirm Password
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password" 
                disabled={loading}
                className="h-10"
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('confirmPassword');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.confirmPassword && <FormMessage className="text-sm text-red-500" />}
          </FormItem>
        )}
      />
    </div>
  );
};
