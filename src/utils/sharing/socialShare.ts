
import { SocialShare } from '@/types/seo';
import { toast } from '@/hooks/use-toast';

/**
 * Share to WhatsApp with improved mobile handling
 */
export const shareToWhatsApp = (shareData: SocialShare) => {
  // For WhatsApp, include just the title and URL, no description
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareData.title}\n${shareData.url}`)}`;
  
  // Use standard window.open with fallback
  const opened = window.open(whatsappUrl, '_blank');
  
  // If window.open failed (which can happen on some mobile browsers)
  if (!opened || opened.closed || typeof opened.closed === 'undefined') {
    // Try changing location as fallback
    window.location.href = whatsappUrl;
  }
  
  toast({
    description: "Opening WhatsApp...",
  });
  
  return true;
};

/**
 * Share to Facebook with improved mobile handling
 */
export const shareToFacebook = (shareData: SocialShare) => {
  // For Facebook, just use the URL and title for better consistent display
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.title)}`;
  
  // Try opening in a popup first
  try {
    const width = 575;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const opened = window.open(
      facebookUrl,
      'facebook-share',
      `width=${width},height=${height},top=${top},left=${left},status=0,toolbar=0`
    );
    
    // Fallback if popup blocker or other issue
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      window.location.href = facebookUrl;
    }
  } catch (e) {
    // Direct navigation fallback
    window.location.href = facebookUrl;
  }
  
  toast({
    description: "Opening Facebook...",
  });
  
  return true;
};

/**
 * Share to Instagram (copy link and provide instructions)
 * with improved mobile experience
 */
export const shareToInstagram = (shareData: SocialShare) => {
  navigator.clipboard.writeText(shareData.url)
    .then(() => {
      toast({
        title: "Instagram Story",
        description: "Link copied! Open Instagram, create a Story, and use the 'Link' sticker to paste the URL.",
      });
      
      // Try to open Instagram app or website
      setTimeout(() => {
        try {
          const instagramUrl = navigator.userAgent.match(/Android/i) 
            ? 'intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end'
            : 'instagram://';
          
          window.location.href = instagramUrl;
        } catch (e) {
          window.open('https://instagram.com', '_blank');
        }
      }, 1000);
    })
    .catch(() => {
      toast({
        title: "Instagram",
        description: "Copy the URL from your address bar then open Instagram and use the link sticker in your story",
      });
      
      setTimeout(() => {
        window.open('https://instagram.com', '_blank');
      }, 1500);
    });
  
  return true;
};

/**
 * Share to TikTok (copy link and redirect)
 * with better mobile experience
 */
export const shareToTikTok = (shareData: SocialShare) => {
  navigator.clipboard.writeText(shareData.url)
    .then(() => {
      toast({
        title: "TikTok",
        description: "Link copied! Open TikTok to create content and paste the URL in your caption.",
      });
      
      // Try to open TikTok app with better mobile detection
      setTimeout(() => {
        try {
          const tiktokUrl = navigator.userAgent.match(/Android/i)
            ? 'intent://www.tiktok.com/#Intent;scheme=https;package=com.zhiliaoapp.musically;end'
            : 'tiktok://';
          
          window.location.href = tiktokUrl;
        } catch (e) {
          window.open('https://www.tiktok.com', '_blank');
        }
      }, 1000);
    })
    .catch(() => {
      // Fallback for clipboard API not working
      toast({
        title: "TikTok",
        description: "Please copy the URL manually then open TikTok to share",
      });
      
      setTimeout(() => {
        window.open('https://www.tiktok.com', '_blank');
      }, 1500);
    });
  
  return true;
};

/**
 * Share to Snapchat with better mobile handling
 */
export const shareToSnapchat = (shareData: SocialShare) => {
  // Try to copy to clipboard first
  navigator.clipboard.writeText(shareData.url)
    .then(() => {
      toast({
        title: "Snapchat",
        description: "Link copied! Create a snap and add the URL from your clipboard.",
      });
      
      // Try to open Snapchat
      setTimeout(() => {
        // Tries to open Snapchat with scan functionality if available 
        const snapchatUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareData.url)}`;
        
        try {
          // Try direct app URL first for mobile devices
          const snapApp = navigator.userAgent.match(/Android/i)
            ? 'intent://snap.com/#Intent;scheme=https;package=com.snapchat.android;end'
            : 'snapchat://';
          
          window.location.href = snapApp;
        } catch (e) {
          // Fall back to web URL
          window.open(snapchatUrl, '_blank');
        }
      }, 1000);
    })
    .catch(() => {
      // Fallback for clipboard API not working
      const snapchatUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(shareData.url)}`;
      window.open(snapchatUrl, '_blank');
      
      toast({
        title: "Snapchat",
        description: "Please copy the URL manually for sharing in Snapchat",
      });
    });
  
  return true;
};
