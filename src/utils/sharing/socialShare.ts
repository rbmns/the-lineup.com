
// Define SocialShare interface and export it
export interface SocialShare {
  title: string;
  text?: string;
  url: string;
  imageUrl?: string;
}

// Share to WhatsApp
export const shareToWhatsApp = (data: SocialShare): void => {
  const text = encodeURIComponent(`${data.title}\n\n${data.text || ''}\n\n${data.url}`);
  const whatsappUrl = `https://wa.me/?text=${text}`;
  window.open(whatsappUrl, '_blank');
};

// Share to Facebook
export const shareToFacebook = (data: SocialShare): void => {
  const url = encodeURIComponent(data.url);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(fbShareUrl, '_blank', 'width=600,height=400');
};

// Share to Snapchat
export const shareToSnapchat = (data: SocialShare): void => {
  const url = encodeURIComponent(data.url);
  const snapchatUrl = `https://snapchat.com/scan?attachmentUrl=${url}`;
  window.open(snapchatUrl, '_blank');
};

// Create a share URL for any platform (helper function)
export const createShareUrl = (platform: string, data: SocialShare): string => {
  const url = encodeURIComponent(data.url);
  const title = encodeURIComponent(data.title);
  const text = data.text ? encodeURIComponent(data.text) : '';
  
  switch (platform.toLowerCase()) {
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${data.title}\n\n${data.text || ''}\n\n${data.url}`)}`;
    case 'snapchat':
      return `https://snapchat.com/scan?attachmentUrl=${url}`;
    default:
      return '';
  }
};
