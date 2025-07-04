
import { Button } from "@/components/ui/button";
import { Icons } from "./ShareIcons";
import { shareToFacebook, shareToWhatsApp, shareToSnapchat, shareToLinkedIn, shareToSignal } from "@/utils/sharing/socialShare";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

export interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  onCopyLink?: () => void;
}

export function ShareButtons({ title, description, url, imageUrl, onCopyLink }: ShareButtonsProps) {
  const isMobile = useIsMobile();

  const handleShare = (platform: string) => {
    try {
      const shareData = { 
        title, 
        text: description, 
        url,
        imageUrl 
      };

      switch (platform) {
        case "facebook":
          shareToFacebook(shareData);
          break;
        case "whatsapp":
          shareToWhatsApp(shareData);
          break;
        case "snapchat":
          shareToSnapchat(shareData);
          break;
        case "linkedin":
          shareToLinkedIn(shareData);
          break;
        case "signal":
          shareToSignal(shareData);
          break;
        default:
          console.log(`Share to ${platform} not implemented`);
      }
    } catch (error) {
      console.error(`Error sharing to ${platform}:`, error);
      toast.error(`Could not share to ${platform}. Please try copying the link instead.`);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Event link copied to clipboard!");
      if (onCopyLink) {
        onCopyLink();
      }
    } catch (error) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success("Event link copied to clipboard!");
        if (onCopyLink) {
          onCopyLink();
        }
      } catch (fallbackError) {
        toast.error("Could not copy link. Please manually copy the URL.");
      }
      document.body.removeChild(textArea);
    }
  };

  // Adjust grid columns for more sharing options - 3 columns for 6 items
  const gridClass = isMobile ? "grid-cols-2 gap-4" : "grid-cols-3 gap-3";

  return (
    <div className={`grid ${gridClass}`}>
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20 hover:bg-blue-50"
        onClick={() => handleShare("facebook")}
      >
        <Icons.facebook className="h-6 w-6 mb-1" />
        <span className="text-xs">Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20 hover:bg-green-50"
        onClick={() => handleShare("whatsapp")}
      >
        <Icons.whatsapp className="h-6 w-6 mb-1" />
        <span className="text-xs">WhatsApp</span>
      </Button>
      
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20 hover:bg-blue-50"
        onClick={() => handleShare("signal")}
      >
        <Icons.signal className="h-6 w-6 mb-1" />
        <span className="text-xs">Signal</span>
      </Button>
      
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20 hover:bg-blue-50"
        onClick={() => handleShare("linkedin")}
      >
        <Icons.linkedin className="h-6 w-6 mb-1" />
        <span className="text-xs">LinkedIn</span>
      </Button>
      
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20 hover:bg-gray-50"
        onClick={handleCopyLink}
      >
        <Icons.link className="h-6 w-6 mb-1" />
        <span className="text-xs">Copy Link</span>
      </Button>
    </div>
  );
}
