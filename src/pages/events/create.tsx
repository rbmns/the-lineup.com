
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
        isMobile ? "py-3 px-3" : "py-12"
      )}>
        <h1 className={cn(
          "text-graphite-grey mb-2",
          isMobile ? "text-xl font-bold" : "text-h1"
        )}>
          Create Event
        </h1>
        <p className={cn(
          "text-graphite-grey mx-auto",
          isMobile ? "text-sm max-w-xs mb-3" : "text-body-base max-w-2xl mb-4"
        )}>
          Share your event with the community
        </p>
        
        {/* Compact Beta Message for Mobile */}
        <div className={cn(
          "p-2 bg-ocean-teal/10 border border-ocean-teal/20 rounded-lg mx-auto",
          isMobile ? "max-w-sm text-xs" : "max-w-md text-sm"
        )}>
          <div className="flex items-center justify-center gap-2 text-ocean-teal font-medium mb-1">
            <span className="text-xs bg-ocean-teal text-white px-2 py-0.5 rounded-full">BETA</span>
            {!isMobile && "We're in Beta!"}
          </div>
          <div className="flex items-center justify-center gap-1 text-graphite-grey">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className={isMobile ? "text-xs" : "text-sm"}>
              Questions? {isMobile ? "Contact" : "Contact us at"} 
            </span>
            <a 
              href="mailto:events@the-lineup.com" 
              className="text-ocean-teal hover:underline font-medium ml-1"
            >
              events@the-lineup.com
            </a>
          </div>
        </div>
      </div>
      
      {/* Form Container */}
      <div className={cn(
        "mx-auto pb-8",
        isMobile ? "px-2 max-w-full" : "px-8 max-w-4xl"
      )}>
        <div className={cn(
          "bg-white rounded-lg border border-mist-grey",
          isMobile ? "p-2" : "p-8"
        )}>
          <EventForm />
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
