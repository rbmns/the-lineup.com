
interface ShareData {
  url: string;
  title?: string;
  text?: string;
  files?: File[];
}

/**
 * Use the Web Share API to share content if available in the browser
 * @param data The data to share (url, title, text, files)
 * @returns Promise that resolves if sharing was successful, rejects otherwise
 */
export const nativeShare = async (data: ShareData): Promise<boolean> => {
  // Check if the Web Share API is supported
  if (navigator.share) {
    try {
      await navigator.share(data);
      return true;
    } catch (error) {
      // User cancelled or share failed
      console.error('Error sharing:', error);
      return false;
    }
  }
  
  // Web Share API not supported
  return false;
};

/**
 * Check if the Web Share API is available in the current browser
 */
export const isNativeShareAvailable = (): boolean => {
  return !!navigator.share;
};

/**
 * Check if the Web Share API with files is available in the current browser
 */
export const isNativeFileShareAvailable = (): boolean => {
  return !!navigator.canShare && navigator.canShare({ files: [] });
};
