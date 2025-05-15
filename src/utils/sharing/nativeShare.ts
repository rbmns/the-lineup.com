
import { toast } from '@/hooks/use-toast';

interface ShareData {
  url: string;
  title?: string;
  text?: string;
  files?: File[];
}

export const shareToNative = async (data: ShareData): Promise<boolean> => {
  try {
    // Check if Web Share API is available
    if (navigator.share) {
      await navigator.share({
        url: data.url,
        title: data.title,
        text: data.text,
        files: data.files
      });
      
      // Don't show a toast message on successful share
      return true;
    } else {
      console.log('Web Share API not available');
      return false;
    }
  } catch (error) {
    // Don't show toast on sharing errors or cancellations
    console.log('Share failed or was cancelled:', error);
    return false;
  }
};
