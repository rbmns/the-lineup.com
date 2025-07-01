
import React, { useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import TimezoneService from '@/services/timezoneService';

export const LocationFields: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();
  const cityValue = form.watch('city');

  // Auto-detect timezone when city changes
  useEffect(() => {
    const detectTimezone = async () => {
      if (cityValue && cityValue.length > 2) {
        try {
          const timezone = await TimezoneService.getTimezoneForCity(cityValue);
          if (timezone) {
            form.setValue('timezone', timezone);
          }
        } catch (error) {
          console.warn('Could not detect timezone for city:', cityValue);
        }
      }
    };

    detectTimezone();
  }, [cityValue, form]);

  return (
    <div className="space-y-4">
      {/* Venue Name - Optional */}
      <FormField
        control={form.control}
        name="venueName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Name (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Beach Club Paradise, Town Hall, etc."
                {...field}
                className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 123 Main Street"
                {...field}
                className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City and Postal Code - Side by side on desktop */}
      <div className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Amsterdam, Lisbon"
                  {...field}
                  className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1012 AB"
                  {...field}
                  className="h-10 bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal"
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
