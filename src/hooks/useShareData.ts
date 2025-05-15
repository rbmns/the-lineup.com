
import { useMemo } from 'react';
import { SocialShare } from '@/types/seo';
import { defaultSeoTags } from '@/utils/seoUtils';
import { getEventUrl } from '@/utils/canonicalUtils';

interface UseShareDataProps {
  title: string;
  url: string;
  imageUrl?: string;
  event?: any;
  description?: string;
}

export const useShareData = ({ title, url, imageUrl, event, description }: UseShareDataProps): SocialShare => {
  return useMemo(() => {
    // Use event image if available, otherwise use default OG image
    const finalImageUrl = imageUrl || (event?.image_urls?.[0] ?? defaultSeoTags.ogImage);
    
    // Create a SEO-friendly title for sharing
    const shareTitle = event ? 
      event.title : 
      `${title} | the lineup`;
    
    // Create a short description (first 10 characters of the event description if available)
    const shareDescription = event?.description ?
      stripHtmlAndTruncate(event.description, 100) :
      description || '';
    
    // Generate the proper SEO-friendly sharing URL
    const shareUrl = event ? 
      `${window.location.origin}/events/${event.slug || event.id}` : 
      url;
    
    // Prepare share data with properly formatted content
    return {
      title: shareTitle,
      text: shareDescription || shareTitle, 
      url: shareUrl,
      image: finalImageUrl,
      hashTags: ['thelineup', 'jointheflow', 'events'],
      description: shareDescription
    };
  }, [title, url, imageUrl, event, description]);
};

// Helper function to strip HTML tags and truncate text
function stripHtmlAndTruncate(html: string, length: number): string {
  if (!html) return '';
  
  // Create temporary element to strip HTML tags
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  const plainText = tempDiv.textContent || tempDiv.innerText || '';
  
  // Truncate to the specified length
  if (plainText.length <= length) return plainText;
  return plainText.substring(0, length) + '...';
}
