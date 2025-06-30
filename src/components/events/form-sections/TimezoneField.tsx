
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { getCommonTimezones, getUserTimezone } from '@/utils/timezone-utils';

export const TimezoneField: React.FC = () => {
  const form = useFormContext<FormValues>();
  const timezones = getCommonTimezones();

  // Set default timezone to user's browser timezone on mount
  React.useEffect(() => {
    const currentValue = form.getValues('timezone');
    if (!currentValue) {
      const userTz = getUserTimezone();
      const matchingTimezone = timezones.find(tz => tz.value === userTz);
      form.setValue('timezone', matchingTimezone?.value || 'Europe/Amsterdam');
    }
  }, [form, timezones]);

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-graphite-grey flex items-center gap-2">
              <span>🌍</span>
              Timezone *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal">
                  <SelectValue placeholder="Select your timezone" />
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
