
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Event } from '@/types';
import { EventShareDialog } from './share/EventShareDialog';
import { cn } from '@/lib/utils';

interface EventShareButtonProps {
  event: Event;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost' | 'link';
  label?: string;
  className?: string;
}

const EventShareButton = ({
  event,
  variant = 'secondary',
  label = 'Share',
  className
}: EventShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleShare = async () => {
    const eventUrl = `${window.location.origin}/events/${event.id}`;
    
    // Check if we're in a restricted environment (like Instagram in-app browser)
    const isRestrictedBrowser = () => {
      const userAgent = navigator.userAgent || '';
      return userAgent.includes('Instagram') || 
             userAgent.includes('FBAN') || 
             userAgent.includes('FBAV') ||
             userAgent.includes('Twitter') ||
             userAgent.includes('LinkedInApp');
    };

    // Try native sharing only if not in restricted browser and native share is available
    if (navigator.share && !isRestrictedBrowser()) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description ? 
            event.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' :
            `Check out ${event.title}`,
          url: eventUrl
        });
        return;
      } catch (error) {
        // User cancelled or share failed, show dialog
        if (error.name !== 'AbortError') {
          console.log('Native share failed, showing dialog:', error);
          setIsOpen(true);
        }
        return;
      }
    }
    
    // Fallback to custom share dialog for all other cases
    setIsOpen(true);
  };

  return (
    <>
      <Button 
        variant={variant} 
        onClick={handleShare}
        className={cn(className)}
        type="button"
      >
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
