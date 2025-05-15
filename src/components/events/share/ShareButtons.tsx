
import { Button } from "@/components/ui/button";
import { Icons } from "./ShareIcons";
import { shareToFacebook, shareToInstagram, shareToWhatsApp, shareToSnapchat } from "@/utils/sharing/socialShare";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "@/hooks/use-toast";

export interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  onCopyLink?: () => void;
}

export function ShareButtons({ title, description, url, onCopyLink }: ShareButtonsProps) {
  const isMobile = useIsMobile();

  const handleShare = (platform: string) => {
    let shared = false;

    switch (platform) {
      case "facebook":
        shared = shareToFacebook({ title, text: description, url });
        break;
      case "instagram":
        // We'll handle this specially since Instagram lacks direct web sharing
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Now you can paste it in Instagram",
        });
        // Try to deep link to Instagram on mobile
        if (isMobile) {
          window.location.href = `instagram://library?AssetPath=${encodeURIComponent(url)}`;
        }
        shared = true;
        break;
      case "whatsapp":
        shared = shareToWhatsApp({ title, text: description, url });
        break;
      case "snapchat":
        shared = shareToSnapchat({ title, text: description, url });
        break;
      default:
        console.log(`Share to ${platform} not implemented`);
    }

    if (shared) {
      toast({
        title: "Sharing initiated",
        description: `Opening ${platform} to share content`,
      });
    }
  };

  // Determine grid columns based on mobile vs desktop
  const gridClass = isMobile ? "grid-cols-2 gap-4" : "grid-cols-4 gap-2";

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
        onClick={() => handleShare("instagram")}
      >
        <Icons.instagram className="h-6 w-6 mb-1" />
        <span className="text-xs">Instagram</span>
      </Button>
      <Button
        variant="outline"
        size={isMobile ? "default" : "sm"}
        className="flex flex-col items-center justify-center h-16 sm:h-20"
        onClick={() => handleShare("snapchat")}
      >
        <Icons.snapchat className="h-6 w-6 mb-1" />
        <span className="text-xs">Snapchat</span>
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
