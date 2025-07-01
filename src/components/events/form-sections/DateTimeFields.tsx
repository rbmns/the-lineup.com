
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { EnhancedDatePicker } from '@/components/ui/enhanced-date-picker';
import { EventFormData } from '@/components/events/form/EventFormSchema';

interface DateTimeFieldsProps {
  form: UseFormReturn<EventFormData>;
}

export const DateTimeFields: React.FC<DateTimeFieldsProps> = ({ form }) => {
  const isMobile = useIsMobile();
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');

  return (
    <div className={cn(
      "bg-gradient-to-r from-ocean-teal/5 to-ocean-teal/10 rounded-lg border border-ocean-teal/20",
      isMobile ? "p-3" : "p-6"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
        <h2 className={cn(
          "font-semibold text-ocean-teal",
          isMobile ? "text-base" : "text-xl"
        )}>Date & Time</h2>
      </div>
      
      <div className="space-y-4">
        {/* Start Date and Time */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <FormField
            control={form.control}
            name="startDate"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Date *
                </FormLabel>
                <FormControl>
                  <EnhancedDatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                    placeholder="Select start date"
                    error={!!fieldState.error}
                    className={cn(
                      "bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  Start Time *
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className={cn(
                      "bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* End Date and Time */}
        <div className={cn(
          "grid gap-3",
          isMobile ? "grid-cols-1" : "grid-cols-2"
        )}>
          <FormField
            control={form.control}
            name="endDate"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Date (Optional)
                </FormLabel>
                <FormControl>
                  <EnhancedDatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                    placeholder="Select end date"
                    error={!!fieldState.error}
                    className={cn(
                      "bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={isMobile ? "text-sm" : undefined}>
                  End Time (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    {...field}
                    className={cn(
                      "bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                      isMobile ? "h-11 text-base" : "h-10"
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Date Validation Message */}
        {startDate && endDate && endDate < startDate && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            End date cannot be before start date. Please adjust your dates.
          </div>
        )}
      </div>
    </div>
  );
};
