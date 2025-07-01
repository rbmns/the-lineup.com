
import React from 'react';
import { Venue } from '@/types';
import { VenueSelect } from '@/components/events/VenueSelect';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface VenueFieldProps {
  venues: Venue[];
  isLoadingVenues: boolean;
  onOpenCreateVenueModal: () => void;
}

export const VenueField: React.FC<VenueFieldProps> = ({ 
  venues, 
  isLoadingVenues, 
  onOpenCreateVenueModal 
}) => {
  const form = useFormContext();
  const isMobile = useIsMobile();

  return (
    <FormField
      control={form.control}
      name="venueId"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="venue_id">Venue</FormLabel>
          <div className={cn(
            "flex gap-2",
            isMobile ? "flex-col" : "flex-row items-center"
          )}>
            <div className="flex-grow">
              <FormControl>
                <VenueSelect
                  id="venue_id"
                  venues={venues}
                  isLoading={isLoadingVenues}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select a venue"
                />
              </FormControl>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenCreateVenueModal}
              className={cn(
                "flex items-center gap-2",
                isMobile ? "w-full justify-center" : "whitespace-nowrap"
              )}
            >
              <PlusCircle className="h-4 w-4" />
              New Venue
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
