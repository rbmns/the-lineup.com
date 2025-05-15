
/**
 * Utility functions for native sharing features
 */

// Check if the browser supports the Web Share API
export const canUseNativeShare = (): boolean => {
  return typeof navigator !== 'undefined' && !!navigator.share;
};

// Handle native sharing with the Web Share API
export const handleNativeShare = async (data: { 
  title?: string; 
  text?: string; 
  url: string;
  files?: File[];
}): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    // User canceled or sharing failed
    console.error('Error sharing:', error);
    return false;
  }
};
