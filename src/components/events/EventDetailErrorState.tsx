
import React from 'react';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';

interface EventDetailErrorStateProps {
  error: Error | null;
  onBackToEvents: () => void;
  notFound?: boolean;
}

export const EventDetailErrorState: React.FC<EventDetailErrorStateProps> = ({ 
  error, 
  onBackToEvents,
  notFound = false 
}) => {
  return (
    <div className="container py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/events">Events</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{notFound ? 'Event not found' : 'Error'}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {notFound ? (
        <p className="text-amber-500">Event not found or unable to load event data.</p>
      ) : (
        <p className="text-red-500">Error loading event: {error?.message}</p>
      )}
      
      <Button variant="outline" onClick={onBackToEvents} className="mt-4">
        {notFound ? 'Return to Events' : 'Go Back'}
      </Button>
    </div>
  );
};
