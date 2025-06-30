
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
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-semibold text-ocean-deep">
              Password
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password"
                disabled={loading}
                className="h-12 text-base border-2 border-mist-grey focus:border-ocean-teal transition-colors"
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('password');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.password && <FormMessage className="text-coral" />}
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="text-base font-semibold text-ocean-deep">
              Confirm Password
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="••••••••" 
                type="password" 
                autoComplete="new-password" 
                disabled={loading}
                className="h-12 text-base border-2 border-mist-grey focus:border-ocean-teal transition-colors"
                onBlur={() => {
                  field.onBlur();
                  handleFieldBlur('confirmPassword');
                }}
                {...field} 
              />
            </FormControl>
            {blurredFields.confirmPassword && <FormMessage className="text-coral" />}
          </FormItem>
        )}
      />
    </div>
  );
};
