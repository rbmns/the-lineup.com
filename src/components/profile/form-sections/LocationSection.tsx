
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { profileFormSchema } from '../ProfileFormSchema';

interface LocationSectionProps {
  form: UseFormReturn<z.infer<typeof profileFormSchema>>;
}

export function LocationSection({ form }: LocationSectionProps) {
  return (
    <FormField
      control={form.control}
      name="location"
      render={({ field }) => (
        <FormItem className="mb-6">
          <FormLabel className="text-base font-medium">Current Location</FormLabel>
          <div className="flex flex-col sm:flex-row gap-2">
            <FormControl>
              <Input 
                placeholder="Enter your location" 
                {...field} 
                className="flex-1 h-12 text-base"
              />
            </FormControl>
          </div>
          <FormDescription className="mt-2 text-sm">
            Adding your location helps you discover nearby events and connect with local friends
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
