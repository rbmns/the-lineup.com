
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Copy } from 'lucide-react';
import { Event } from '@/types';

interface ShareDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
}

export interface SocialShare {
  title: string;
  url: string;
  text?: string; 
  description?: string; // Added description property
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ event, isOpen, onClose }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);
  
  // Create the share URL and text for the event
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/events/${event.id}`
    : `https://example.com/events/${event.id}`;
    
  const shareTitle = `Check out ${event.title} on EventHub!`;
  const shareText = event.description 
    ? `${event.title} - ${event.description.slice(0, 100)}${event.description.length > 100 ? '...' : ''}`
    : `Join me at ${event.title}!`;
  
  const socialShare: SocialShare = {
    title: shareTitle,
    url: shareUrl,
    text: shareText,
    description: `${event.title} - Join me at this event!`
  };

  // Handle dialog close
  const handleClose = () => {
    setIsDialogOpen(false);
    if (onClose) onClose();
  };
  
  // Copy event URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        toast({
          title: "Link Copied",
          description: "Event link copied to clipboard!",
          variant: "default",
        });
      })
      .catch((error) => {
        console.error('Failed to copy:', error);
        toast({
          title: "Copy Failed",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
          <DialogDescription>
            Share this event with friends and social media
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 mt-4">
          <Input
            readOnly
            value={shareUrl}
            className="flex-1"
          />
          <Button 
            size="icon"
            variant="outline"
            onClick={copyToClipboard}
            aria-label="Copy link"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        
        <ShareButtons shareData={socialShare} />
      </DialogContent>
    </Dialog>
  );
};
