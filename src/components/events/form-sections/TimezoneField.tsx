
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { getCommonTimezones } from '@/utils/timezone-utils';

interface TimezoneFieldProps {
  autoDetectedTimezone?: string;
  venueName?: string;
}

export const TimezoneField: React.FC<TimezoneFieldProps> = ({ 
  autoDetectedTimezone, 
  venueName 
}) => {
  const form = useFormContext<FormValues>();
  const timezones = getCommonTimezones();

  // Set auto-detected timezone when available
  React.useEffect(() => {
    if (autoDetectedTimezone && !form.getValues('timezone')) {
      form.setValue('timezone', autoDetectedTimezone);
    }
  }, [autoDetectedTimezone, form]);

  const selectedTimezone = form.watch('timezone');
  const isAutoDetected = selectedTimezone === autoDetectedTimezone;

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-graphite-grey flex items-center gap-2">
              <span>🌍</span>
              Event Timezone
              {isAutoDetected && venueName && (
                <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                  Auto-detected from {venueName}
                </span>
              )}
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal">
                  <SelectValue placeholder="Select event timezone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-mist-grey shadow-lg max-h-60 overflow-y-auto">
                {timezones.map((timezone) => (
                  <SelectItem 
                    key={timezone.value} 
                    value={timezone.value}
                    className="hover:bg-mist-grey/50 focus:bg-mist-grey cursor-pointer"
                  >
                    {timezone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {autoDetectedTimezone && (
              <p className="text-xs text-graphite-grey/75">
                Events will show in each viewer's local timezone automatically
              </p>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
