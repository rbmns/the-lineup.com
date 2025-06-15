
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
      defaultValue={event.status}
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

export const EventsTable = () => {
  const { data: events, isLoading } = useEvents(undefined, { includePastEvents: true });

  if (isLoading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!events || events.length === 0) {
    return <p>No events found.</p>;
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.creator?.username || 'N/A'}</TableCell>
              <TableCell>{event.venues?.name || 'N/A'}</TableCell>
              <TableCell>
                {event.start_date ? format(new Date(event.start_date), 'PPP') : 'N/A'}
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
