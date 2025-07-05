import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

export const BookingInfoSection: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "bg-coastal-haze/30 rounded-lg border border-mist-grey shadow-sm",
      isMobile ? "p-3" : "p-6"
    )}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-2 h-2 bg-ocean-teal rounded-full"></div>
        <h2 className={cn(
          "font-semibold text-ocean-teal",
          isMobile ? "text-base" : "text-xl"
        )}>Booking Info (Optional)</h2>
      </div>
      
      <div className="space-y-3">
        {/* Booking Link */}
        <FormField
          control={form.control}
          name="bookingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Booking Link (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. https://eventbrite.com/your-event"
                  className={isMobile ? "h-11 text-base" : "h-10"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fee */}
        <FormField
          control={form.control}
          name="fee"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Fee (€) (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className={isMobile ? "h-11 text-base" : "h-10"}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Additional Info */}
        <FormField
          control={form.control}
          name="additionalInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-graphite-grey">
                Additional Info (Optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any extra details about booking, requirements, what to bring..."
                  className="resize-none"
                  rows={3}
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