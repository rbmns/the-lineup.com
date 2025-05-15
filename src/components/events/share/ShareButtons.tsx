
import { Button } from "@/components/ui/button";
import { Icons } from "./ShareIcons";
import { socialShare } from "@/utils/sharing/socialShare";

export interface ShareButtonsProps {
  title: string;
  description: string;
  url: string;
  onCopyLink?: () => void;
}

export function ShareButtons({ title, description, url, onCopyLink }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    socialShare(platform, { title, description, url });
  };

  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="outline"
        size="sm"
        className="flex flex-col items-center justify-center h-20"
        onClick={() => handleShare("twitter")}
      >
        <Icons.twitter className="h-8 w-8 mb-1" />
        <span className="text-xs">Twitter</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex flex-col items-center justify-center h-20"
        onClick={() => handleShare("facebook")}
      >
        <Icons.facebook className="h-8 w-8 mb-1" />
        <span className="text-xs">Facebook</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex flex-col items-center justify-center h-20"
        onClick={() => handleShare("linkedin")}
      >
        <Icons.linkedin className="h-8 w-8 mb-1" />
        <span className="text-xs">LinkedIn</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="flex flex-col items-center justify-center h-20"
        onClick={onCopyLink}
      >
        <Icons.link className="h-8 w-8 mb-1" />
        <span className="text-xs">Copy Link</span>
      </Button>
    </div>
  );
}
