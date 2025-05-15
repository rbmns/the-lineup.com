
import React from 'react';
import { Button } from '@/components/ui/button';
import { SocialShare } from '@/utils/sharing/socialShare';
import { 
  shareToFacebook, 
  shareToTwitter, 
  shareToLinkedIn, 
  shareToWhatsApp, 
  shareToEmail, 
  shareToTelegram 
} from '@/utils/sharing';
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Send 
} from 'lucide-react';

// Custom WhatsApp icon component
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.301-.767.966-.94 1.164-.173.199-.347.223-.646.075-.3-.15-1.269-.467-2.416-1.483-.893-.795-1.494-1.78-1.67-2.079-.173-.3-.018-.462.13-.612.134-.13.3-.345.45-.52.149-.174.199-.3.299-.498.1-.2.05-.374-.025-.524-.075-.15-.672-1.62-.922-2.206-.242-.579-.487-.5-.672-.51-.172-.008-.371-.01-.571-.01-.2 0-.522.074-.795.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.2 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export interface ShareButtonsProps {
  shareData: SocialShare;
}

export function ShareButtons({ shareData }: ShareButtonsProps) {
  const handleShare = (platform: string) => {
    switch (platform) {
      case 'facebook':
        return shareToFacebook(shareData);
      case 'twitter':
        return shareToTwitter(shareData);
      case 'linkedin':
        return shareToLinkedIn(shareData);
      case 'whatsapp':
        return shareToWhatsApp(shareData);
      case 'email':
        return shareToEmail(shareData);
      case 'telegram':
        return shareToTelegram(shareData);
      default:
        return false;
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('facebook')}
        aria-label="Share to Facebook"
      >
        <Facebook className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('twitter')}
        aria-label="Share to Twitter"
      >
        <Twitter className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('linkedin')}
        aria-label="Share to LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('whatsapp')}
        aria-label="Share to WhatsApp"
      >
        <WhatsAppIcon />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('telegram')}
        aria-label="Share to Telegram"
      >
        <Send className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => handleShare('email')}
        aria-label="Share via Email"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );
}
