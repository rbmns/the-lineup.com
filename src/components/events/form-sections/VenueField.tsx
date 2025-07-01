
import React from 'react';
import { Venue } from '@/types';
import { VenueSelect } from '@/components/events/VenueSelect';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

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

  return (
    <FormField
      control={form.control}
      name="venueId"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="venue_id">Venue</FormLabel>
          <div className="flex items-center gap-2">
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
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Venue
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
