
import React from 'react';
import { 
  Copy, Facebook, MessageCircle, Share, Instagram, 
  History, Link2
} from 'lucide-react';
import { handleNativeShare, canUseNativeShare } from '@/utils/sharing/nativeShare';
import { shareToWhatsApp, shareToFacebook, shareToInstagram, 
         shareToTikTok, shareToSnapchat } from '@/utils/sharing/socialShare';
import { copyToClipboard } from '@/utils/sharing/clipboardUtils';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { 
  WhatsAppIcon, FacebookIcon, InstagramIcon,
  TikTokIcon, SnapchatIcon
} from './ShareIcons';

interface ShareButtonsProps {
  url: string;
  title: string;
  description?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  url, 
  title,
  description = ''
}) => {
  const handleCopyLink = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      toast({
        title: "Link copied",
        description: "URL copied to clipboard",
        variant: "success",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Could not copy the URL",
        variant: "destructive",
      });
    }
  };
  
  const handleWhatsAppShare = () => {
    shareToWhatsApp(title, url);
  };
  
  const handleFacebookShare = () => {
    shareToFacebook(url);
  };
  
  const handleInstagramShare = () => {
    shareToInstagram(url);
  };
  
  const handleTikTokShare = () => {
    shareToTikTok(url);
  };
  
  const handleSnapchatShare = () => {
    shareToSnapchat(url);
  };
  
  const handleDeviceShare = async () => {
    if (canUseNativeShare()) {
      await handleNativeShare({
        title,
        text: description,
        url
      });
    } else {
      toast({
        title: "Not supported",
        description: "Native sharing not supported on this device",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
      <Button
        variant="outline"
        onClick={handleCopyLink}
        className="flex items-center gap-2 justify-center"
      >
        <Copy className="h-4 w-4" />
        <span>Copy link</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2 justify-center"
      >
        <WhatsAppIcon className="h-4 w-4" />
        <span>WhatsApp</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={handleFacebookShare}
        className="flex items-center gap-2 justify-center"
      >
        <FacebookIcon className="h-4 w-4" />
        <span>Facebook</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={handleInstagramShare}
        className="flex items-center gap-2 justify-center"
      >
        <InstagramIcon className="h-4 w-4" />
        <span>Instagram</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={handleTikTokShare}
        className="flex items-center gap-2 justify-center"
      >
        <History className="h-4 w-4" />
        <span>TikTok</span>
      </Button>
      
      <Button
        variant="outline"
        onClick={handleSnapchatShare}
        className="flex items-center gap-2 justify-center"
      >
        <SnapchatIcon className="h-4 w-4" />
        <span>Snapchat</span>
      </Button>
      
      {canUseNativeShare() && (
        <Button
          variant="outline"
          onClick={handleDeviceShare}
          className="flex items-center gap-2 justify-center col-span-2 sm:col-span-3"
        >
          <Share className="h-4 w-4" />
          <span>Share on device</span>
        </Button>
      )}
    </div>
  );
};
