
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/types";
import { ShareButtons } from "./ShareButtons";
import { copyToClipboard } from "@/utils/sharing/clipboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEventImages } from "@/hooks/useEventImages";

export interface EventShareDialogProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EventShareDialog({ event, isOpen, onOpenChange }: EventShareDialogProps) {
  const isMobile = useIsMobile();
  const { getEventImageUrl } = useEventImages();
  
  const getEventUrl = () => {
    return `${window.location.origin}/events/${event.id}`;
  };

  const getShareTitle = () => {
    // Use the event title as the main share title
    return event.title;
  };

  const getShareDescription = () => {
    if (event.description) {
      // Strip HTML and truncate to 150 characters for better social sharing
      const plainText = event.description.replace(/<[^>]*>/g, '');
      return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
    }
    return `Join us for ${event.title}`;
  };

  const getShareImage = () => {
    return getEventImageUrl(event) || 'https://raw.githubusercontent.com/rbmns/images/main/lineup/default.jpg';
  };

  const handleCopyLink = async () => {
    await copyToClipboard(getEventUrl());
    onOpenChange(false);
  };

  // Adjust dialog size for mobile and ensure white background
  const dialogContentClass = isMobile 
    ? "px-3 py-4 bg-white border border-gray-200" 
    : "sm:max-w-md bg-white border border-gray-200";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle className="text-gray-900">Share {event.title}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <ShareButtons 
            title={getShareTitle()}
            description={getShareDescription()}
            url={getEventUrl()}
            imageUrl={getShareImage()}
            onCopyLink={handleCopyLink}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
