
import React, { useState } from 'react';
import { Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { canUseNativeShare, handleNativeShare } from '@/utils/sharing';
import { Event } from '@/types';
import { useEventImages } from '@/hooks/useEventImages';
import { ShareButtons } from './share/ShareButtons';

interface EventShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
  event?: Event;
}

export const EventShareButton: React.FC<EventShareButtonProps> = ({
  url,
  title,
  description = '',
  className = '',
  event
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const { getShareImageUrl } = useEventImages();
  
  const handleShare = async () => {
    // Try native sharing first, fall back to dialog
    if (canUseNativeShare()) {
      const imageUrl = event ? getShareImageUrl(event) : undefined;
      const success = await handleNativeShare({ 
        title, 
        text: description, 
        url 
      });
      
      if (!success) {
        setShowDialog(true);
      }
    } else {
      setShowDialog(true);
    }
  };

  return (
    <>
      <Button 
        variant="secondary"
        size="icon" 
        className={`h-10 w-10 rounded-full bg-white/80 text-gray-800 hover:bg-white border border-gray-200 ${className}`}
        onClick={handleShare}
      >
        <Share className="h-5 w-5" />
      </Button>
      
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share this event</DialogTitle>
          </DialogHeader>
          <ShareButtons 
            url={url} 
            title={title} 
            description={description} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
