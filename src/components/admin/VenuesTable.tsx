
import React from 'react';
import { useVenues } from '@/hooks/useVenues';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Venue } from '@/types';

interface VenueCreator {
  id: string;
  username: string | null;
}

const useVenueCreators = (venues: Venue[]) => {
  const creatorIds = React.useMemo(() => 
    [...new Set(venues.map(v => v.creator_id).filter(Boolean))] as string[]
  , [venues]);

  return useQuery<VenueCreator[], Error>({
    queryKey: ['profiles', 'creators', creatorIds],
    queryFn: async () => {
      if (creatorIds.length === 0) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', creatorIds);
      if (error) throw error;
      return data as VenueCreator[];
    },
    enabled: creatorIds.length > 0,
  });
};

export const VenuesTable = () => {
  const { venues, isLoading: isLoadingVenues } = useVenues();
  const { data: creators, isLoading: isLoadingCreators } = useVenueCreators(venues);

  const creatorMap = React.useMemo(() => {
    const map = new Map<string, string>();
    if (creators) {
      creators.forEach(c => c.id && c.username && map.set(c.id, c.username));
    }
    return map;
  }, [creators]);

  if (isLoadingVenues || (venues.length > 0 && isLoadingCreators)) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!venues || venues.length === 0) {
    return <p>No venues found.</p>;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Creator</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {venues.map((venue) => (
            <TableRow key={venue.id}>
              <TableCell className="font-medium">{venue.name}</TableCell>
              <TableCell>{venue.city}</TableCell>
              <TableCell>{(venue.creator_id && creatorMap.get(venue.creator_id)) || 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
