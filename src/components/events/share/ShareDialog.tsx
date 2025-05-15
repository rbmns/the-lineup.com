
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ShareButtons } from './ShareButtons';
import { SocialShare } from '@/types/seo';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareData: SocialShare;
  canNativeShare: boolean;
  attemptNativeShare: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({ 
  open, 
  onOpenChange, 
  shareData, 
  canNativeShare,
  attemptNativeShare 
}) => {
  // Don't render if shareData is empty
  if (!shareData || !shareData.url) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] mx-auto font-inter max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle className="font-inter">Share event</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <ShareButtons 
            shareData={shareData}
            canNativeShare={canNativeShare}
            attemptNativeShare={attemptNativeShare}
            onShareComplete={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
