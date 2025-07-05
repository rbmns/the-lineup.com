
import React, { useEffect, useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import TimezoneService from '@/services/timezoneService';
import { useVenues } from '@/hooks/useVenues';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Mail } from 'lucide-react';

export const LocationFields: React.FC = () => {
  const form = useFormContext();
  const isMobile = useIsMobile();
  const cityValue = form.watch('city');
  const addressValue = form.watch('address');
  const postalCodeValue = form.watch('postalCode');
  const venueNameValue = form.watch('venueName');
  const [showVenueSuggestions, setShowVenueSuggestions] = useState(false);
  const [locationValidationError, setLocationValidationError] = useState<string | null>(null);
  const [isValidatingLocation, setIsValidatingLocation] = useState(false);
  
  const { venues = [] } = useVenues();

  // Filter venues based on venue name input
  const filteredVenues = venues.filter(venue => 
    venueNameValue && 
    venue.name?.toLowerCase().includes(venueNameValue.toLowerCase()) &&
    venueNameValue.length > 2
  ).slice(0, 5);

  // Auto-detect timezone and validate location when city changes
  useEffect(() => {
    const validateAndDetectTimezone = async () => {
      if (cityValue && cityValue.length > 2) {
        setIsValidatingLocation(true);
        setLocationValidationError(null);
        
        try {
          const timezone = await TimezoneService.getTimezoneForCity(cityValue);
          if (timezone) {
            form.setValue('timezone', timezone);
            setLocationValidationError(null);
          } else {
            setLocationValidationError(`Could not find timezone for "${cityValue}". Please check the city name spelling.`);
          }
        } catch (error) {
          console.warn('Could not detect timezone for city:', cityValue);
          setLocationValidationError(`Unable to validate location "${cityValue}". Please double-check the spelling or try a different format.`);
        } finally {
          setIsValidatingLocation(false);
        }
      }
    };

    const debounce = setTimeout(validateAndDetectTimezone, 500);
    return () => clearTimeout(debounce);
  }, [cityValue, form]);

  // Validate address format
  useEffect(() => {
    if (addressValue && addressValue.length > 0) {
      // Basic address validation - should contain at least a number or letter
      const hasValidFormat = /^[a-zA-Z0-9\s,.-]+$/.test(addressValue);
      if (!hasValidFormat) {
        setLocationValidationError('Please enter a valid address format (e.g., "123 Main Street")');
      } else if (locationValidationError?.includes('address')) {
        setLocationValidationError(null);
      }
    }
  }, [addressValue, locationValidationError]);

  // Validate postal code format
  useEffect(() => {
    if (postalCodeValue && postalCodeValue.length > 0) {
      // Basic postal code validation - should be alphanumeric
      const hasValidFormat = /^[a-zA-Z0-9\s-]+$/.test(postalCodeValue);
      if (!hasValidFormat) {
        setLocationValidationError('Please enter a valid postal code format');
      } else if (locationValidationError?.includes('postal')) {
        setLocationValidationError(null);
      }
    }
  }, [postalCodeValue, locationValidationError]);

  const handleVenueSelect = (venue: any) => {
    form.setValue('venueName', venue.name);
    form.setValue('address', venue.street || '');
    form.setValue('city', venue.city || '');
    form.setValue('postalCode', venue.postal_code || '');
    setShowVenueSuggestions(false);
    setLocationValidationError(null);
  };

  // Function to extract address from Google Maps URL
  const extractAddressFromGoogleMaps = (url: string) => {
    try {
      // Extract address from various Google Maps URL formats
      const patterns = [
        /place\/([^\/]+)\//,  // place/address/
        /query=([^&]+)/,      // query=address
        /@([\d.-]+),([\d.-]+)/ // coordinates
      ];
      
      for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
          let address = decodeURIComponent(match[1].replace(/\+/g, ' '));
          // Clean up the address
          address = address.replace(/,.*$/, ''); // Remove everything after first comma
          return address;
        }
      }
      return null;
    } catch (error) {
      console.warn('Could not extract address from Google Maps URL:', error);
      return null;
    }
  };

  // Watch Google Maps field and auto-fill address
  const googleMapsValue = form.watch('googleMaps');
  useEffect(() => {
    if (googleMapsValue && googleMapsValue.includes('maps.google') && !addressValue) {
      const extractedAddress = extractAddressFromGoogleMaps(googleMapsValue);
      if (extractedAddress) {
        form.setValue('address', extractedAddress);
      }
    }
  }, [googleMapsValue, addressValue, form]);

  return (
    <div className="space-y-3">
      {/* Location Validation Alert */}
      {locationValidationError && (
        <Alert variant="destructive" className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <div className="mb-2">{locationValidationError}</div>
            <div className="text-xs text-gray-600 flex items-center gap-1">
              <Mail className="h-3 w-3" />
              Having trouble? Contact us at{' '}
              <a 
                href="mailto:events@the-lineup.com" 
                className="text-ocean-teal hover:underline font-medium"
              >
                events@the-lineup.com
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

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
          <div className="absolute z-50 w-full mt-1 bg-pure-white border border-mist-grey rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredVenues.map((venue) => (
              <button
                key={venue.id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-coastal-haze border-b border-mist-grey last:border-b-0"
                onClick={() => handleVenueSelect(venue)}
              >
                <div className="font-medium text-sm text-graphite-grey">{venue.name}</div>
                <div className="text-xs text-graphite-grey/60">
                  {venue.street}, {venue.city}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Google Maps Link */}
      <FormField
        control={form.control}
        name="googleMaps"
        render={({ field }) => (
          <FormItem>
            <FormLabel className={isMobile ? "text-sm" : undefined}>
              Google Maps Link (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="https://maps.google.com/..."
                {...field}
                className={cn(
                    isMobile ? "h-11 text-base" : "h-10"
                )}
              />
            </FormControl>
            <div className="text-xs text-graphite-grey/60 mt-1">
              Paste a Google Maps link and we'll try to auto-fill the address
            </div>
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
            <FormLabel className={isMobile ? "text-sm" : undefined}>
              Address
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., 123 Main Street"
                {...field}
                className={cn(
                  isMobile ? "h-11 text-base" : "h-10",
                  locationValidationError?.includes('address') && "border-orange-300"
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
                City * {isValidatingLocation && <span className="text-xs text-gray-500">(validating...)</span>}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Amsterdam, Lisbon"
                  {...field}
                  className={cn(
                    isMobile ? "h-11 text-base" : "h-10",
                    locationValidationError?.includes('timezone') && "border-orange-300"
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
                Postal Code
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 1012 AB"
                  {...field}
                  className={cn(
                    isMobile ? "h-11 text-base" : "h-10",
                    locationValidationError?.includes('postal') && "border-orange-300"
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
