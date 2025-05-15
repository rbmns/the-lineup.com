
// Define SocialShare interface and export it
export interface SocialShare {
  title: string;
  text?: string;
  url: string;
  imageUrl?: string;
}

// Share to WhatsApp
export const shareToWhatsApp = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const whatsappUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
  window.open(whatsappUrl, '_blank');
};

// Share to Twitter/X
export const shareToTwitter = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  window.open(twitterUrl, '_blank');
};

// Share to Facebook
export const shareToFacebook = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  window.open(facebookUrl, '_blank');
};

// Share to LinkedIn
export const shareToLinkedIn = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const encodedTitle = encodeURIComponent(data.title);
  const encodedSummary = data.text ? encodeURIComponent(data.text) : '';
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`;
  window.open(linkedInUrl, '_blank');
};

// Share to Telegram
export const shareToTelegram = (data: SocialShare): void => {
  const text = data.text ? `${data.title}: ${data.text}` : data.title;
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(data.url);
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  window.open(telegramUrl, '_blank');
};

// Share to Snapchat
export const shareToSnapchat = (data: SocialShare): void => {
  const encodedUrl = encodeURIComponent(data.url);
  const snapchatUrl = `https://www.snapchat.com/scan?attachmentUrl=${encodedUrl}`;
  window.open(snapchatUrl, '_blank');
};
