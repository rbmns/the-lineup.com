
import React, { useState, useMemo } from 'react';
import { Venue } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface VenueSelectProps {
  id?: string;
  venues: Venue[];
  isLoading: boolean;
  value?: string;
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
  const [isOpen, setIsOpen] = useState(false);

  const filteredVenues = useMemo(() => {
    if (!searchQuery.trim()) return venues;
    
    return venues.filter(venue =>
      venue.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [venues, searchQuery]);

  const selectedVenue = venues.find(venue => venue.id === value);

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger id={id}>
          <SelectValue placeholder="Loading venues..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger id={id}>
        <SelectValue placeholder={placeholder}>
          {selectedVenue ? selectedVenue.name : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        <div className="flex items-center px-3 py-2 border-b">
          <Search className="h-4 w-4 mr-2 text-gray-500" />
          <Input
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
          />
        </div>
        {filteredVenues.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500">
            {searchQuery ? 'No venues found matching your search.' : 'No venues available.'}
          </div>
        ) : (
          filteredVenues.map((venue) => (
            <SelectItem key={venue.id} value={venue.id}>
              <div className="flex flex-col">
                <span className="font-medium">{venue.name}</span>
                {venue.city && (
                  <span className="text-sm text-gray-500">{venue.city}</span>
                )}
              </div>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
};
