
export interface SocialShare {
  title: string;
  text: string;
  url: string;
  image?: string;
}

export const shareToFacebook = (data: SocialShare) => {
  const url = new URL('https://www.facebook.com/sharer/sharer.php');
  url.searchParams.append('u', data.url);
  
  window.open(url.toString(), 'facebook-share', 'width=580,height=296');
  return true;
};

export const shareToTwitter = (data: SocialShare) => {
  const url = new URL('https://twitter.com/intent/tweet');
  url.searchParams.append('text', data.title);
  url.searchParams.append('url', data.url);
  
  window.open(url.toString(), 'twitter-share', 'width=550,height=235');
  return true;
};

export const shareToLinkedIn = (data: SocialShare) => {
  const url = new URL('https://www.linkedin.com/shareArticle');
  url.searchParams.append('mini', 'true');
  url.searchParams.append('url', data.url);
  url.searchParams.append('title', data.title);
  url.searchParams.append('summary', data.text);
  
  window.open(url.toString(), 'linkedin-share', 'width=750,height=500');
  return true;
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

