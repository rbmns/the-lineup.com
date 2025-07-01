
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

export const TitleField: React.FC = () => {
  const form = useFormContext();
  
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
