
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Venue } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { filterVenues } from './venue-filter/VenueFilterUtils';

interface VenueSelectProps {
  id: string;
  venues: Venue[];
  isLoading: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const VenueSelect: React.FC<VenueSelectProps> = ({
  id,
  venues,
  isLoading,
  value,
  onChange,
  placeholder = "Select a venue"
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  // Transform venues to format needed by filterVenues
  const venueOptions = venues.map(venue => ({
    value: venue.id,
    label: venue.name
  }));

  // Filter venues based on search query
  const filteredVenues = filterVenues(venueOptions, searchQuery);

  // Map back to Venue format for rendering
  const displayVenues = filteredVenues.map(option => {
    return venues.find(venue => venue.id === option.value);
  }).filter(Boolean) as Venue[];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <div className="flex items-center border rounded-md px-3 mb-2">
            <Search className="h-4 w-4 text-gray-400 mr-2" />
            <Input 
              className="h-8 border-0 p-0 focus-visible:ring-0 placeholder:text-gray-400"
              placeholder="Search venues..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        {displayVenues.length > 0 ? (
          displayVenues.map((venue) => (
            <SelectItem key={venue.id} value={venue.id}>
              {venue.name}
            </SelectItem>
          ))
        ) : (
          <div className="text-center py-2 text-sm text-gray-500">No venues found</div>
        )}
      </SelectContent>
    </Select>
  );
};
