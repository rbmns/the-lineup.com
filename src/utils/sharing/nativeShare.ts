
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

export interface NativeShareData {
  url: string;
  title?: string;
  text?: string;
  image?: string; // For sharing images
}

/**
 * Check if the current device supports native sharing
 */
export const canUseNativeShare = (): boolean => {
  return !!navigator.share;
};

/**
 * Check if the current device is likely a mobile device
 */
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Share content using the Web Share API if available
 * Falls back to platform-specific sharing methods on mobile
 */
export const shareToNative = async (data: NativeShareData): Promise<boolean> => {
  // Web Share API is the primary method - works on mobile browsers and some desktop browsers
  if (navigator.share) {
    try {
      await navigator.share({
        url: data.url,
        title: data.title,
        text: data.text,
      });
      return true;
    } catch (error: any) {
      // User canceled or share failed
      if (error.name !== 'AbortError') {
        console.error('Error sharing content:', error);
        toast({
          title: "Sharing failed",
          description: "There was a problem sharing this content.",
          variant: "destructive"
        });
      }
      return false;
    }
  } 
  
  // If Web Share API isn't available but we're on mobile, try app-specific deep links
  else if (isMobileDevice()) {
    // Detect platform and use platform-specific sharing if possible
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.indexOf('android') > -1) {
      // Android Intent
      const intentUrl = `intent://send?text=${encodeURIComponent(data.title + '\n' + data.url)}#Intent;scheme=whatsapp;package=com.whatsapp;end`;
      window.location.href = intentUrl;
      return true;
    } 
    else if (userAgent.indexOf('iphone') > -1 || userAgent.indexOf('ipad') > -1) {
      // iOS URL Scheme
      window.location.href = `whatsapp://send?text=${encodeURIComponent(data.title + '\n' + data.url)}`;
      return true;
    }
  }
  
  // If no sharing method worked, notify the user
  toast({
    title: "Sharing not supported",
    description: "Your browser doesn't support direct sharing. You can copy the link instead.",
    variant: "default"
  });
  
  return false;
};

