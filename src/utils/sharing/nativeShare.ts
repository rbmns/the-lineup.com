
import { toast } from '@/hooks/use-toast';

export interface NativeShareData {
  url: string;
  title?: string;
  text?: string;
}

/**
 * Share content using the Web Share API if available
 */
export const shareToNative = async (data: NativeShareData): Promise<boolean> => {
  // Check if native sharing is available
  if (navigator.share) {
    try {
      await navigator.share({
        url: data.url,
        title: data.title,
        text: data.text
      });
      return true;
    } catch (error: any) {
      // User canceled or share failed
      if (error.name !== 'AbortError') {
        console.error('Error sharing content:', error);
        toast({
          title: "Sharing failed",
          description: "There was a problem sharing this content.",
          variant: "destructive"
        });
      }
      return false;
    }
  } else {
    toast({
      title: "Sharing not supported",
      description: "Your browser doesn't support direct sharing.",
      variant: "default"
    });
    return false;
  }
};
