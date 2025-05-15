
import { toast } from '@/hooks/use-toast';

/**
 * Copies URL to clipboard and shows toast notification
 * with improved handling for iOS and Android differences
 */
export const copyToClipboard = (url: string) => {
  navigator.clipboard.writeText(url)
    .then(() => {
      toast({
        description: "Link copied to clipboard!",
      });
    })
    .catch(() => {
      // Fallback method for older browsers or restricted environments
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      try {
        document.execCommand('copy');
        toast({
          description: "Link copied to clipboard!",
        });
      } catch (err) {
        toast({
          title: "Couldn't copy",
          description: "Please manually copy the URL from your browser's address bar.",
        });
      }
      
      document.body.removeChild(textarea);
    });
  return true;
};
