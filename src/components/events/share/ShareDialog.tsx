
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import { copyToClipboard } from '@/utils/sharing/clipboardUtils';
import { toast } from '@/hooks/use-toast';

interface ShareDialogProps {
  title: string;
  description: string;
  eventUrl: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ 
  title, 
  description, 
  eventUrl,
  open,
  onOpenChange
}) => {
  const isMobile = useIsMobile();

  const handleCopyLink = async () => {
    const success = await copyToClipboard(eventUrl);
    if (success) {
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste it anywhere you want",
      });
      onOpenChange?.(false);
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please try again or share manually",
        variant: "destructive"
      });
    }
  };

  // Adjust dialog size for mobile
  const dialogContentClass = isMobile ? "px-3 py-4" : "sm:max-w-md";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ShareButtons 
            title={title}
            description={description}
            url={eventUrl}
            onCopyLink={handleCopyLink}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
