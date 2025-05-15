
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

export const shareToWhatsApp = (data: SocialShare) => {
  const text = `${data.title} - ${data.url}`;
  let whatsappUrl;
  
  // Check if it's mobile or desktop
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // Mobile
    whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;
  } else {
    // Desktop
    whatsappUrl = `https://web.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }
  
  window.open(whatsappUrl, '_blank');
  return true;
};

export const shareToSnapchat = (data: SocialShare) => {
  // Snapchat has a web sharing API but it's not as widely supported
  const url = new URL('https://www.snapchat.com/share');
  url.searchParams.append('url', data.url);
  
  window.open(url.toString(), 'snapchat-share', 'width=580,height=296');
  return true;
};
