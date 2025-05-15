
/**
 * Utility functions for sharing to social media platforms
 */

export const shareToWhatsApp = (text: string, url: string): void => {
  const encodedText = encodeURIComponent(`${text}\n\n${url}`);
  window.open(`https://wa.me/?text=${encodedText}`, '_blank');
};

export const shareToFacebook = (url: string): void => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
};

export const shareToInstagram = (url: string): void => {
  // Instagram doesn't have a direct share URL like other platforms
  // Instead, we'll copy to clipboard and provide instructions
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('URL copied! Instagram doesn\'t support direct sharing via web. Please paste the URL in your Instagram post or story.');
    })
    .catch(err => {
      console.error('Failed to copy URL: ', err);
    });
};

export const shareToTikTok = (url: string): void => {
  // Similar to Instagram, TikTok doesn't support direct web sharing
  navigator.clipboard.writeText(url)
    .then(() => {
      alert('URL copied! TikTok doesn\'t support direct sharing via web. Please paste the URL in your TikTok video description.');
    })
    .catch(err => {
      console.error('Failed to copy URL: ', err);
    });
};

export const shareToSnapchat = (url: string): void => {
  window.open(`https://www.snapchat.com/scan?attachmentUrl=${encodeURIComponent(url)}`, '_blank');
};
