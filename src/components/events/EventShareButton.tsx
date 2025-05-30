
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Event } from '@/types';
import { EventShareDialog } from './share/EventShareDialog';

interface EventShareButtonProps {
  event: Event;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  label?: string;
}

const EventShareButton = ({
  event,
  variant = 'secondary',
  label = 'Share'
}: EventShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const getEventUrl = () => {
    // Use event slug if available, otherwise use ID
    const path = event.slug 
      ? `/events/${event.slug}` 
      : `/events/${event.id}`;
    
    return `${window.location.origin}${path}`;
  };

  // Check if we're in Instagram's in-app browser or other social media browsers
  const isInAppBrowser = () => {
    const userAgent = navigator.userAgent || '';
    return userAgent.includes('Instagram') || 
           userAgent.includes('FBAN') || 
           userAgent.includes('FBAV') ||
           userAgent.includes('Twitter') ||
           userAgent.includes('LinkedInApp');
  };

  const handleShare = async () => {
    // For in-app browsers (like Instagram), always show the dialog
    if (isInAppBrowser()) {
      setIsOpen(true);
      return;
    }

    // Try native sharing for other browsers
    if (navigator.share) {
      try {
        await navigator.share({
          url: getEventUrl(),
          title: event.title,
          text: event.description
        });
      } catch (error) {
        // User cancelled or share failed, show dialog
        if (error.name !== 'AbortError') {
          setIsOpen(true);
        }
      }
    } else {
      // Native sharing not supported, show dialog
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button variant={variant} onClick={handleShare}>
        <Share2 size={16} className="mr-2" />
        {label}
      </Button>

      <EventShareDialog
        event={event}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
      />
    </>
  );
};

export default EventShareButton;
