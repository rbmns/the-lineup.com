
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from './share/ShareButtons';
import { Share2 } from 'lucide-react';
import { Event } from '@/types';
import { shareToNative } from '@/utils/sharing/nativeShare';
import { copyToClipboard } from '@/utils/sharing/clipboardUtils';

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

  const handleShare = async () => {
    try {
      const eventUrl = getEventUrl();
      const shared = await shareToNative({
        url: eventUrl,
        title: event.title,
        text: event.description
      });
      
      if (!shared) {
        // If native sharing fails or isn't available, open the dialog
        setIsOpen(true);
      }
    } catch (error) {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    await copyToClipboard(getEventUrl());
    setIsOpen(false);
  };

  return (
    <>
      <Button variant={variant} onClick={handleShare}>
        <Share2 size={16} className="mr-2" />
        {label}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {event.title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ShareButtons 
              title={event.title} 
              description={event.description || ""} 
              url={getEventUrl()}
              onCopyLink={handleCopyLink}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EventShareButton;
