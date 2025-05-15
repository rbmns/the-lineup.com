
/**
 * Utility for native web sharing functionality
 */

interface ShareData {
  title: string;
  text?: string;
  url: string;
}

/**
 * Check if the browser supports native sharing
 */
export const canUseNativeShare = (): boolean => {
  return !!navigator.share;
};

/**
 * Share content using the browser's native share API
 */
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  try {
    if (!canUseNativeShare()) {
      console.log('Native sharing not supported');
      return false;
    }
    
    await navigator.share({
      title: data.title,
      text: data.text || '',
      url: data.url
    });
    
    return true;
  } catch (error) {
    // User cancelled or sharing failed
    console.error('Error sharing content:', error);
    return false;
  }
};
