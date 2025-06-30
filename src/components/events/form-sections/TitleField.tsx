
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

interface TitleFieldProps {
  errors: FieldErrors<FormValues>;
}

export const TitleField: React.FC<TitleFieldProps> = ({ errors }) => {
  const form = useFormContext<FormValues>();
  
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-graphite-grey">
            Event Title *
          </FormLabel>
          <FormControl>
            <Input
              placeholder="e.g., Beach Volleyball Tournament"
              className="h-10"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
