
/**
 * Social media sharing utilities
 */

/**
 * Generate Twitter/X share URL
 */
export const getTwitterShareUrl = (text: string, url: string, hashtags?: string[]): string => {
  const params = new URLSearchParams({
    text,
    url
  });
  
  if (hashtags && hashtags.length > 0) {
    params.append('hashtags', hashtags.join(','));
  }
  
  return `https://twitter.com/intent/tweet?${params.toString()}`;
};

/**
 * Generate Facebook share URL
 */
export const getFacebookShareUrl = (url: string): string => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
};

/**
 * Generate WhatsApp share URL
 */
export const getWhatsAppShareUrl = (text: string, url: string): string => {
  const message = `${text} ${url}`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
};

/**
 * Generate LinkedIn share URL
 */
export const getLinkedInShareUrl = (url: string, title: string): string => {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
};

/**
 * Generate Telegram share URL
 */
export const getTelegramShareUrl = (url: string, text: string): string => {
  return `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
};
