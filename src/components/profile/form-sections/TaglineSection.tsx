
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';

interface TaglineSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
}

export function TaglineSection({ form }: TaglineSectionProps) {
  return (
    <FormField
      control={form.control}
      name="tagline"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Tagline</FormLabel>
          <FormControl>
            <Textarea
              placeholder="A short description about yourself."
              className="resize-none"
              {...field}
            />
          </FormControl>
          <FormDescription>
            Write a short tagline about yourself.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
