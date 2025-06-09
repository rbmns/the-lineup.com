
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

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    
    // Try native sharing first
    if (navigator.share && !isInAppBrowser()) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || `Check out ${event.title}`,
          url: eventUrl
        });
        return;
      } catch (error) {
        // User cancelled or share failed, show dialog
        if (error.name !== 'AbortError') {
          setIsOpen(true);
        }
        return;
      }
    }
    
    // Fallback to custom share dialog
    setIsOpen(true);
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
