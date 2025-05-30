
// Define SocialShare interface and export it
export interface SocialShare {
  title: string;
  text?: string;
  url: string;
  imageUrl?: string;
}

// Helper function to detect if we're in an in-app browser
const isInAppBrowser = (): boolean => {
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('Instagram') || 
         userAgent.includes('FBAN') || 
         userAgent.includes('FBAV') ||
         userAgent.includes('Twitter') ||
         userAgent.includes('LinkedInApp');
};

// Share to WhatsApp
export const shareToWhatsApp = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  
  // For in-app browsers, try to open in the same window
  if (isInAppBrowser()) {
    window.location.href = whatsappUrl;
  } else {
    window.open(whatsappUrl, '_blank');
  }
};

// Share to Twitter/X
export const shareToTwitter = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  
  if (isInAppBrowser()) {
    window.location.href = twitterUrl;
  } else {
    window.open(twitterUrl, '_blank');
  }
};

// Share to Facebook
export const shareToFacebook = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  
  if (isInAppBrowser()) {
    window.location.href = facebookUrl;
  } else {
    window.open(facebookUrl, '_blank');
  }
};

// Share to LinkedIn
export const shareToLinkedIn = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedSummary = data.text ? encodeURIComponent(data.text) : '';
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
  
  if (isInAppBrowser()) {
    window.location.href = linkedInUrl;
  } else {
    window.open(linkedInUrl, '_blank');
  }
};

// Share to Telegram
export const shareToTelegram = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  
  if (isInAppBrowser()) {
    window.location.href = telegramUrl;
  } else {
    window.open(telegramUrl, '_blank');
  }
};

// Share to Snapchat
export const shareToSnapchat = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const snapchatUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
  
  if (isInAppBrowser()) {
    window.location.href = snapchatUrl;
  } else {
    window.open(snapchatUrl, '_blank');
  }
};
