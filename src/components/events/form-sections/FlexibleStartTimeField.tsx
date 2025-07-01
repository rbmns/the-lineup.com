
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormDescription } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';

interface FlexibleStartTimeFieldProps {
  form: UseFormReturn<any>;
}

export const FlexibleStartTimeField: React.FC<FlexibleStartTimeFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="flexibleStartTime"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-medium">
              Flexible start time
            </FormLabel>
            <FormDescription className="text-xs text-gray-600">
              Check this if people can join at any time (e.g., markets, open sessions) rather than having a fixed start time (e.g., classes, workshops)
            </FormDescription>
          </div>
        </FormItem>
      )}
    />
  );
};
