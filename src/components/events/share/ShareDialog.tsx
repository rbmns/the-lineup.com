
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';
import { useIsMobile } from '@/hooks/use-mobile';
import { copyToClipboard } from '@/utils/sharing/clipboardUtils';

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
    await copyToClipboard(eventUrl);
    onOpenChange?.(false);
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
