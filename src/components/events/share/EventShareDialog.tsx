
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/types";
import { ShareButtons } from "./ShareButtons";
import { copyToClipboard } from "@/utils/sharing/clipboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";
import { ShareTrigger } from "./ShareTrigger";

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
    const success = await copyToClipboard(getEventUrl());
    if (success) {
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste it anywhere you want",
      });
      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={dialogContentClass}>
        <DialogHeader>
          <DialogTitle>Share {event.title}</DialogTitle>
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
