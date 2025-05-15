
export interface SocialShare {
  title: string;
  text: string;
  url: string;
  image?: string;
  hashTags?: string[];
  description?: string;
}

export const shareToFacebook = (data: SocialShare) => {
  const url = new URL('https://www.facebook.com/sharer/sharer.php');
  url.searchParams.append('u', data.url);
  
  window.open(url.toString(), 'facebook-share', 'width=580,height=296');
  return true;
};

export const shareToInstagram = (data: SocialShare) => {
  // Instagram doesn't have a direct web sharing API like other platforms
  // We'll use a toast to tell users to copy the link and share manually
  // This is a common pattern for Instagram sharing
  alert('Instagram does not support direct sharing. Copy the link and share via Instagram app.');
  return false;
};

export const shareToWhatsApp = (data: SocialShare) => {
  const text = `${data.title} - ${data.url}`;
  const url = new URL('https://api.whatsapp.com/send');
  url.searchParams.append('text', text);
  
  window.open(url.toString(), 'whatsapp-share', 'width=580,height=296');
  return true;
};

export const shareToEmail = (data: SocialShare) => {
  const subject = encodeURIComponent(data.title);
  const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
  return true;
};

export const shareToTelegram = (data: SocialShare) => {
  const url = new URL('https://t.me/share/url');
  url.searchParams.append('url', data.url);
  url.searchParams.append('text', data.title);
  
  window.open(url.toString(), 'telegram-share', 'width=580,height=296');
  return true;
};

export const shareToSnapchat = (data: SocialShare) => {
  // Snapchat has a web sharing API but it's not as widely supported
  const url = new URL('https://www.snapchat.com/share');
  url.searchParams.append('url', data.url);
  
  window.open(url.toString(), 'snapchat-share', 'width=580,height=296');
  return true;
};
