
import { Button } from "@/components/ui/button";
import { Icons } from "./ShareIcons";
import { shareToFacebook, shareToWhatsApp, shareToSnapchat } from "@/utils/sharing/socialShare";
import { useIsMobile } from "@/hooks/use-mobile";

export interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  onCopyLink?: () => void;
}

export function ShareButtons({ title, description, url, onCopyLink }: ShareButtonsProps) {
  const isMobile = useIsMobile();

  const handleShare = (platform: string) => {
    switch (platform) {
      case "facebook":
        shareToFacebook({ title, text: description, url });
        break;
      case "whatsapp":
        shareToWhatsApp({ title, text: description, url });
        break;
      case "snapchat":
        shareToSnapchat({ title, text: description, url });
        break;
      default:
        console.log(`Share to ${platform} not implemented`);
    }
  };

  // Determine grid columns based on mobile vs desktop
  const gridClass = isMobile ? "grid-cols-2 gap-4" : "grid-cols-3 gap-2";

  return (
    <div className={`grid ${gridClass}`}>
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20"
        onClick={() => handleShare("facebook")}
      >
        <Icons.facebook className="h-6 w-6 mb-1" />
        <span className="text-xs">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20"
        onClick={() => handleShare("whatsapp")}
      >
        <Icons.whatsapp className="h-6 w-6 mb-1" />
        <span className="text-xs">WhatsApp</span>
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20"
        onClick={onCopyLink}
      >
        <Icons.link className="h-6 w-6 mb-1" />
        <span className="text-xs">Copy Link</span>
      </Button>
    </div>
  );
}
