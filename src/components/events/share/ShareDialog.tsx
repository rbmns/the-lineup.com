
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShareButtons } from "./ShareButtons";
import { ShareTrigger } from "./ShareTrigger";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { shareToNative } from "@/utils/sharing/nativeShare";
import { copyToClipboard } from "@/utils/sharing/clipboardUtils";

export interface ShareDialogProps {
  title: string;
  description?: string;
  eventUrl: string;
}

export function ShareDialog({ title, description, eventUrl }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleShare = async () => {
    try {
      const shared = await shareToNative({
        url: eventUrl,
        title: title,
        text: description
      });
      
      if (!shared) {
        // If native sharing fails or isn't available, open the dialog
        setIsOpen(true);
      }
    } catch (error) {
      setIsOpen(true);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(eventUrl);
    if (success) {
      toast({
        title: "Link copied",
        description: "Event link copied to clipboard",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Failed to copy",
        description: "Please try again or share manually",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <ShareTrigger onClick={handleShare} />
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share {title}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ShareButtons 
              title={title} 
              description={description || ""} 
              url={eventUrl}
              onCopyLink={handleCopyLink}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
