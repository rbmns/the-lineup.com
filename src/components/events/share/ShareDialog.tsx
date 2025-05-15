
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from './ShareButtons';

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4">
            <ShareButtons 
              title={title}
              description={description}
              url={eventUrl}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
