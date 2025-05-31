
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/types";
import { ShareButtons } from "./ShareButtons";
import { copyToClipboard } from "@/utils/sharing/clipboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";

export interface EventShareDialogProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EventShareDialog({ event, isOpen, onOpenChange }: EventShareDialogProps) {
  const isMobile = useIsMobile();
  
  const getEventUrl = () => {
    const path = event.slug 
      ? `/events/${event.slug}` 
      : `/events/${event.id}`;
    
    return `${window.location.origin}${path}`;
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
            title={event.title} 
            description={event.description || ""} 
            url={getEventUrl()}
            onCopyLink={handleCopyLink}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
