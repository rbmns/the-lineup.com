
import React from 'react';
import { FieldErrors } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';

interface DescriptionFieldProps {
  errors: FieldErrors<FormValues>;
}

export const DescriptionField: React.FC<DescriptionFieldProps> = ({ errors }) => {
  const form = useFormContext<FormValues>();
  
  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium text-graphite-grey">
            Description *
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Tell people what your event is about, what to expect, what to bring..."
              className="min-h-[120px]"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
