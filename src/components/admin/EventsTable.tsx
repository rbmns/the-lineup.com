
import React from 'react';
import { useEvents } from '@/hooks/useEvents';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const EventsTable = () => {
  const { data: events, isLoading } = useEvents();

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
