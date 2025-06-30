
import React from 'react';
import { EventForm } from '@/components/events/EventForm';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Mail } from 'lucide-react';

const CreateEvent = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full bg-pure-white">
      {/* Header Section */}
      <div className={cn(
        "section-content text-center",
        isMobile ? "py-4 px-4" : "py-12"
      )}>
        <h1 className={cn(
          "text-graphite-grey mb-2",
          isMobile ? "text-2xl font-bold" : "text-h1"
        )}>
          Create Event
        </h1>
        <p className={cn(
          "text-graphite-grey mx-auto",
          isMobile ? "text-sm max-w-xs" : "text-body-base max-w-2xl"
        )}>
          Share your event with the community
        </p>
        
        {/* Beta Message */}
        <div className={cn(
          "mt-4 p-3 bg-ocean-teal/10 border border-ocean-teal/20 rounded-lg mx-auto",
          isMobile ? "max-w-xs text-xs" : "max-w-md text-sm"
        )}>
          <div className="flex items-center justify-center gap-2 text-ocean-teal font-medium mb-1">
            <span className="text-xs bg-ocean-teal text-white px-2 py-0.5 rounded-full">BETA</span>
            We're in Beta!
          </div>
          <div className="flex items-center justify-center gap-1 text-graphite-grey">
            <Mail className="h-3 w-3" />
            <span>Questions? Contact us at </span>
            <a 
              href="mailto:events@the-lineup.com" 
              className="text-ocean-teal hover:underline font-medium"
            >
              events@the-lineup.com
            </a>
          </div>
        </div>
      </div>
      
      {/* Form Container */}
      <div className={cn(
        "mx-auto pb-8",
        isMobile ? "px-4 max-w-full" : "px-8 max-w-4xl"
      )}>
        <div className={cn(
          "bg-white rounded-lg border border-mist-grey",
          isMobile ? "p-4" : "p-8"
        )}>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
