
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ShareButtons } from './ShareButtons';
import { useEventImages } from '@/hooks/useEventImages';
import { 
  shareToNative, 
  copyToClipboard,
  type SocialShare
} from '@/utils/sharing';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function ShareDialog({ isOpen, onClose, event }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const { getShareImageUrl } = useEventImages();
  
  // Create the canonical URL for sharing
  const shareUrl = `${window.location.origin}/events/${event.slug || event.id}`;
  
  // Create the share data object
  const shareData: SocialShare = {
    title: event.title,
    text: event.description || `Join me at ${event.title}`,
    url: shareUrl,
    image: getShareImageUrl(event) || '',
  };

  // Reset the copied state when the dialog opens/closes
  useEffect(() => {
    setCopied(false);
  }, [isOpen]);

  const handleCopy = async () => {
    try {
      await copyToClipboard(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The event link has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "There was an error copying the link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    try {
      await shareToNative({
        title: event.title,
        text: event.description || `Join me at ${event.title}`,
        url: shareUrl,
      });
      
      toast({
        title: "Sharing...",
        description: "Opening share dialog.",
      });
    } catch (error) {
      toast({
        title: "Failed to share",
        description: "There was an error opening the share dialog. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
          <DialogDescription>
            Invite your friends to join you at {event.title}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6">
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <p className="text-sm text-muted-foreground truncate">
                {shareUrl}
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="px-3"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy</span>
            </Button>
          </div>
          
          <ShareButtons shareData={shareData} />
          
          {navigator.share && (
            <div className="flex justify-center">
              <Button className="w-full" onClick={handleNativeShare}>
                Share via...
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
