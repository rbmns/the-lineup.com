
import React from 'react';
import { UseFormWatch, UseFormSetValue, FieldErrors } from 'react-hook-form';
import { Venue } from '@/types';
import { FormValues } from '@/components/events/form/EventFormTypes';
import { VenueSelect } from '@/components/events/VenueSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

interface VenueFieldProps {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  venues: Venue[];
  isLoadingVenues: boolean;
  onOpenCreateVenueModal: () => void;
}

export const VenueField: React.FC<VenueFieldProps> = ({ watch, setValue, errors, venues, isLoadingVenues, onOpenCreateVenueModal }) => (
  <div>
    <Label htmlFor="venue_id">Venue</Label>
    <div className="flex items-center gap-2">
      <div className="flex-grow">
        <VenueSelect
          id="venue_id"
          venues={venues}
          isLoading={isLoadingVenues}
          value={watch("venue_id")}
          onChange={(venueId) => setValue("venue_id", venueId)}
          placeholder="Select a venue"
        />
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
    {errors.venue_id && (
      <p className="text-red-500 text-sm mt-1">{errors.venue_id.message}</p>
    )}
  </div>
);
