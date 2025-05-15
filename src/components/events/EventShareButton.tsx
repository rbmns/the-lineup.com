
import React, { useState, useEffect } from 'react';
import { Dialog } from "@/components/ui/dialog";
import { useDeviceDetection } from '@/hooks/useDeviceDetection';
import { handleNativeShare } from '@/utils/sharing';
import { ShareDialog } from './share/ShareDialog';
import { ShareTrigger } from './share/ShareTrigger';
import { useShareData } from '@/hooks/useShareData';

interface EventShareButtonProps {
  title: string;
  url: string;
  imageUrl?: string;
  description?: string;
  event?: any; // Add event object for SEO-friendly URLs
}

export const EventShareButton = ({ title, url, imageUrl, description, event }: EventShareButtonProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isMobile, canNativeShare, isIOS, isAndroid } = useDeviceDetection();
  
  // Don't render the component if there's no title or URL
  if (!title || !url) {
    return null;
  }
  
  // Get optimized share data from our custom hook
  const shareData = useShareData({ title, url, imageUrl, event });

  // Ensure proper viewport setup for mobile sharing
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport && isMobile) {
      // Store the original content
      const originalContent = metaViewport.getAttribute('content') || '';
      
      // Set optimized viewport for mobile sharing
      metaViewport.setAttribute(
        'content', 
        'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
      );
      
      return () => {
        // Restore original viewport settings when component unmounts
        metaViewport.setAttribute('content', originalContent);
      };
    }
  }, [isMobile, dialogOpen]);

  const handleShareButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Always try native sharing on mobile first
    if (isMobile && canNativeShare) {
      attemptNativeShare();
    } else {
      // Show dialog for desktop or if native sharing isn't available
      setDialogOpen(true);
    }
  };

  const attemptNativeShare = async () => {
    console.log("Attempting native share");
    const success = await handleNativeShare(shareData);
    if (!success) {
      // If native sharing fails or is cancelled, show the dialog
      console.log("Native share failed, showing dialog");
      setDialogOpen(true);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <ShareTrigger 
        onClick={handleShareButtonClick} 
        disabled={!shareData || !shareData.url}
      />
      <ShareDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shareData={shareData}
        canNativeShare={canNativeShare}
        attemptNativeShare={attemptNativeShare}
      />
    </Dialog>
  );
};
