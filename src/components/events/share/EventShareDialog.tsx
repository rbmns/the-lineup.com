
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Event } from "@/types";
import { ShareButtons } from "./ShareButtons";
import { toast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/utils/sharing/clipboardUtils";

export interface EventShareDialogProps {
  event: Event;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function EventShareDialog({ event, isOpen, onOpenChange }: EventShareDialogProps) {
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
        title: "Link copied",
        description: "Event link copied to clipboard",
      });
      onOpenChange(false);
    } else {
      toast({
        title: "Failed to copy",
        description: "Please try again or share manually",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
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
