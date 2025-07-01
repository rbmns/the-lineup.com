
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import TimezoneService from '@/services/timezoneService';
import { useVenues } from '@/hooks/useVenues';

export const LocationFields: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();
  const cityValue = form.watch('city');
  const venueNameValue = form.watch('venueName');
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  
  const { venues = [] } = useVenues();

  // Filter venues based on venue name input
  const filteredVenues = venues.filter(venue => 
    venueNameValue && 
    venue.name?.toLowerCase().includes(venueNameValue.toLowerCase()) &&
    venueNameValue.length > 2
  ).slice(0, 5); // Limit to 5 suggestions

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

  const handleVenueSelect = (venue: any) => {
    form.setValue('venueName', venue.name);
    // Use street field from venue
    form.setValue('address', venue.street || '');
    form.setValue('city', venue.city || '');
    form.setValue('postalCode', venue.postal_code || '');
    setShowVenueSuggestions(false);
  };

  return (
    <div className="space-y-3">
      {/* Venue Name with Suggestions */}
      <div className="relative">
        <FormField
          control={form.control}
          name="venueName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isMobile ? "text-sm" : undefined}>
                Venue Name (Optional)
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Beach Club Paradise, Town Hall..."
                  {...field}
                  className={cn(
                    "bg-white border-mist-grey hover:border-ocean-teal focus:border-ocean-teal",
                    isMobile ? "h-11 text-base" : "h-10"
                  )}
                  onFocus={() => setShowVenueSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowVenueSuggestions(false), 200)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Venue Suggestions */}
        {showVenueSuggestions && filteredVenues.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredVenues.map((venue) => (
              <button
                key={venue.id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => handleVenueSelect(venue)}
              >
                <div className="font-medium text-sm">{venue.name}</div>
                <div className="text-xs text-gray-500">
                  {venue.street}, {venue.city}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Address - Now Required */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isMobile ? "text-sm" : undefined}>
              Address *
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 123 Main Street"
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

      {/* City and Postal Code */}
      <div className={cn(
        "grid gap-3",
        isMobile ? "grid-cols-1" : "grid-cols-2"
      )}>
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isMobile ? "text-sm" : undefined}>
                City *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Amsterdam, Lisbon"
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

        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={isMobile ? "text-sm" : undefined}>
                Postal Code *
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1012 AB"
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
    </div>
  );
};
