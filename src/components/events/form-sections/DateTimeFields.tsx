
import React from 'react';
import { FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface DateTimeFieldsProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ watch, setValue, errors }) => {
  const form = useFormContext<FormValues>();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      {/* Start Date & Time */}
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Start Date *
              </FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => date && field.onChange(date)}
                  className="w-full h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Start Time *
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* End Date & Time */}
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                End Date
              </FormLabel>
              <FormControl>
                <DatePicker
                  selected={field.value}
                  onSelect={(date) => date && field.onChange(date)}
                  className="w-full h-10"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                End Time
              </FormLabel>
              <FormControl>
                <Input
                  type="time"
                  className="h-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
