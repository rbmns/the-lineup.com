
import { SocialShare } from '@/types/seo';
import { toast } from '@/hooks/use-toast';

/**
 * Handles native share functionality using the Web Share API
 * with improved error handling for mobile platforms
 */
export const handleNativeShare = async (shareData: SocialShare) => {
  try {
    console.log("Attempting to use native share with:", shareData);
    if (navigator.share) {
      // When sharing, only include the title and URL for cleaner sharing
      // Omit text/description for cleaner sharing experience
      await navigator.share({
        title: shareData.title,
        url: shareData.url
      });
      console.log("Native share completed");
      toast({
        description: "Thanks for sharing!",
      });
      return true;
    } else {
      console.log("Native sharing not available");
      return false;
    }
  } catch (error) {
    console.error('Error sharing:', error);
    if (error instanceof Error) {
      // User cancelled the share operation, don't show an error
      if (error.name === 'AbortError') {
        console.log('User cancelled share operation');
        return false;
      }
    }
    
    // Only show toast on actual errors, not user cancellations
    toast({
      description: "Couldn't share directly. Please try one of our sharing options.",
    });
    return false;
  }
};
