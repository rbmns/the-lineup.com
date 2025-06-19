
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Event } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const EventStatusUpdater = ({ event }: { event: Event }) => {
  const queryClient = useQueryClient();

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update({ status })
        .eq('id', eventId)
        .select()
        .single();

      if (error) {
        console.error('Error updating event status:', error);
        throw new Error(error.message);
      }
      return data;
    },
    onSuccess: () => {
      toast.success('Event status updated.');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error(`Failed to update status: ${error.message}`);
    },
  });

  if (!event.id) return null;

  return (
    <Select
      defaultValue={event.status || 'draft'}
      onValueChange={(newStatus) => {
        if (event.id) {
            updateStatus({ eventId: event.id, status: newStatus });
        }
      }}
      disabled={isPending}
    >
      <SelectTrigger className="w-40 capitalize">
        <SelectValue placeholder="Set status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Draft</SelectItem>
        <SelectItem value="pending_approval">Pending Approval</SelectItem>
        <SelectItem value="published">Published</SelectItem>
        <SelectItem value="rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800';
    case 'pending_approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'rejected':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const EventsTable = () => {
  // Use includePastEvents: true and includeAllStatuses: true for admin view
  const { data: events, isLoading } = useEvents(undefined, { 
    includePastEvents: true,
    includeAllStatuses: true 
  });

  console.log('Admin EventsTable - Events loaded:', events?.length || 0);

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">No events found.</p>
        <p className="text-sm text-gray-400">Events will appear here once they are created.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Creator</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Current Status</TableHead>
            <TableHead>Update Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                {event.title || 'Untitled Event'}
              </TableCell>
              <TableCell>
                {event.creator?.username || 'Unknown Creator'}
              </TableCell>
              <TableCell>
                {event.venues?.name || 'No Venue'}
              </TableCell>
              <TableCell>
                {event.start_date ? format(new Date(event.start_date), 'PPP') : 'No Date'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(event.status || 'draft')}>
                  {event.status || 'draft'}
                </Badge>
              </TableCell>
              <TableCell>
                <EventStatusUpdater event={event} />
              </TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/events/${event.id}`}>View</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
