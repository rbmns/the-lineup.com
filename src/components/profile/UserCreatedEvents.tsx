
import React from 'react';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { deleteEvent } from '@/lib/eventService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export const UserCreatedEvents: React.FC = () => {
    const { data: events, isLoading, error } = useUserCreatedEvents();
    const queryClient = useQueryClient();

    const handleDelete = async (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            const { error } = await deleteEvent(eventId);
            if (error) {
                toast.error('Failed to delete event.');
                console.error('Delete event error:', error);
            } else {
                toast.success('Event deleted successfully.');
                queryClient.invalidateQueries({ queryKey: ['user-created-events'] });
                queryClient.invalidateQueries({ queryKey: ['events'] });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return <p className="text-destructive">Error loading your events: {error.message}</p>;
    }

    if (!events || events.length === 0) {
        return (
            <div className="text-center py-10 border-dashed border-2 rounded-lg">
                <h3 className="text-lg font-medium">No events created yet</h3>
                <p className="text-muted-foreground mt-1">Ready to create your first event?</p>
                <Button asChild className="mt-4">
                    <Link to="/events/create">Create Event</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event: Event) => (
                <Card key={event.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {formatEventCardDateTime(event.start_date, event.start_time)}
                        </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
                        <Button asChild variant="outline" size="sm">
                            <Link to={`/events/${event.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                            Delete
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
};
