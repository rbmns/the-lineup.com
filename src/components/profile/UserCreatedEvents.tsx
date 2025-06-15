import React from 'react';
import { useUserCreatedEvents } from '@/hooks/useUserCreatedEvents';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { deleteEvent } from '@/lib/eventService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { formatEventCardDateTime } from '@/utils/date-formatting';
import { Event } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export const UserCreatedEvents: React.FC = () => {
    const { data: events, isLoading, error } = useUserCreatedEvents();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: async (eventId: string) => {
            const { error } = await deleteEvent(eventId);
            if (error) throw error;
            return eventId;
        },
        onMutate: async (eventId: string) => {
            await queryClient.cancelQueries({ queryKey: ['user-created-events'] });
            const previousEvents = queryClient.getQueryData<Event[]>(['user-created-events']);
    
            if (previousEvents) {
                const updatedEvents = previousEvents.filter(event => event.id !== eventId);
                queryClient.setQueryData(['user-created-events'], updatedEvents);
            }
            
            toast.success("Event removed. The list will update shortly.");
    
            return { previousEvents };
        },
        onError: (err, eventId, context) => {
            if (context?.previousEvents) {
                queryClient.setQueryData(['user-created-events'], context.previousEvents);
            }
            toast.error('Failed to delete event.');
            console.error('Delete event error:', err);
        },
        onSettled: (eventId) => {
            queryClient.invalidateQueries({ queryKey: ['user-created-events'] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            if (eventId) {
              queryClient.invalidateQueries({ queryKey: ['event-details', eventId] });
            }
        },
    });

    const handleDelete = (eventId: string) => {
        if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            deleteMutation.mutate(eventId);
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

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Compare with start of day
    const firstPastEventIndex = events.findIndex(event => new Date(event.start_date) < now);

    return (
        <div className="space-y-4">
            {events.map((event: Event, index: number) => (
                <React.Fragment key={event.id}>
                    {firstPastEventIndex !== -1 && index === firstPastEventIndex && (
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-background px-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Past Events
                                </span>
                            </div>
                        </div>
                    )}
                    <Card className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
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
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete(event.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending && deleteMutation.variables === event.id ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </Card>
                </React.Fragment>
            ))}
        </div>
    );
};
