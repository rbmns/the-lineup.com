
import React from 'react';
import { Button } from "@/components/ui/button";
import { SocialShare } from '@/types/seo';
import { 
  copyToClipboard,
  handleNativeShare,
  shareToWhatsApp,
  shareToFacebook,
  shareToInstagram,
  shareToTikTok,
  shareToSnapchat
} from '@/utils/sharing';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  SnapchatIcon
} from './ShareIcons';

interface ShareButtonsProps {
  shareData: SocialShare;
  canNativeShare: boolean;
  attemptNativeShare: () => void;
  onShareComplete: () => void;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ 
  shareData, 
  canNativeShare, 
  attemptNativeShare,
  onShareComplete
}) => {
  // Platform-specific share handlers
  const handleWhatsAppShare = () => {
    shareToWhatsApp(shareData);
    onShareComplete();
  };

  const handleFacebookShare = () => {
    shareToFacebook(shareData);
    onShareComplete();
  };

  const handleInstagramShare = () => {
    shareToInstagram(shareData);
    onShareComplete();
  };

  const handleTikTokShare = () => {
    shareToTikTok(shareData);
    onShareComplete();
  };

  const handleSnapchatShare = () => {
    shareToSnapchat(shareData);
    onShareComplete();
  };

  const handleCopyLink = () => {
    copyToClipboard(shareData.url);
    onShareComplete();
  };

  return (
    <>
      {canNativeShare && (
        <Button 
          onClick={attemptNativeShare} 
          variant="default" 
          className="w-full font-inter bg-black text-white hover:bg-black/90 transition-all duration-300 hover:-translate-y-0.5"
        >
          Share via device options
        </Button>
      )}
      
      <Button 
        onClick={handleWhatsAppShare} 
        variant="outline" 
        className="w-full font-inter flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      >
        <WhatsAppIcon />
        WhatsApp
      </Button>
      
      <Button 
        onClick={handleFacebookShare} 
        variant="outline" 
        className="w-full font-inter flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      >
        <FacebookIcon />
        Facebook
      </Button>
      
      <Button 
        onClick={handleInstagramShare} 
        variant="outline" 
        className="w-full font-inter flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      >
        <InstagramIcon />
        Instagram Story
      </Button>
      
      <Button 
        onClick={handleTikTokShare} 
        variant="outline" 
        className="w-full font-inter flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      >
        <TikTokIcon />
        TikTok
      </Button>
      
      <Button 
        onClick={handleSnapchatShare} 
        variant="outline" 
        className="w-full font-inter flex items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-0.5"
      >
        <SnapchatIcon />
        Snapchat
      </Button>
      
      <Button 
        onClick={handleCopyLink} 
        variant="outline" 
        className="w-full font-inter transition-all duration-300 hover:-translate-y-0.5"
      >
        Copy link
      </Button>
    </>
  );
};
