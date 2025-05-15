
import { useEffect } from 'react';
import { Event } from '@/types';
import { getEventOgTags, updateDocumentMetaTags, resetToDefaultMetaTags } from '@/utils/seoUtils';
import { useEventImages } from '@/hooks/useEventImages';
import { useShareData } from '@/hooks/useShareData';

/**
 * Hook to manage meta tags for an event detail page
 */
export const useEventMetaTags = (event: Event | null) => {
  const { getShareImageUrl } = useEventImages();

  useEffect(() => {
    if (event) {
      const updateMetaTags = async () => {
        try {
          console.log("Updating event meta tags for:", event.title);
          
          // Generate SEO-friendly URL for this event
          const baseUrl = window.location.origin;
          const canonicalUrl = `${baseUrl}/events/${event.slug || event.id}`;
          
          // Get a short description from the event
          let shortDescription = '';
          if (event.description) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = event.description;
            const plainText = tempDiv.textContent || tempDiv.innerText || '';
            shortDescription = plainText.substring(0, 100) + (plainText.length > 100 ? '...' : '');
          }
          
          // Get OG tags for the event with proper SEO optimization
          const ogTags = await getEventOgTags({
            title: event.title,
            description: shortDescription,
            image_urls: event.image_urls
          });
          
          // Add the canonical URL to OG tags
          ogTags.url = canonicalUrl;
          
          // Ensure we have a valid image URL for sharing
          if (!ogTags.image || ogTags.image === '') {
            ogTags.image = getShareImageUrl(event);
          }
          
          console.log("Generated OG tags:", ogTags);
          
          // Update all document meta tags
          updateDocumentMetaTags(ogTags);
          console.log("Meta tags updated successfully");
          
          // Add canonical link element
          let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
          if (!canonicalLink) {
            canonicalLink = document.createElement('link') as HTMLLinkElement;
            canonicalLink.rel = 'canonical';
            document.head.appendChild(canonicalLink);
            console.log("Created new canonical link");
          }
          canonicalLink.href = canonicalUrl;
          console.log("Set canonical URL to:", canonicalUrl);
          
          // Add or update keywords meta tag
          let keywordsTag = document.querySelector('meta[name="keywords"]');
          if (!keywordsTag) {
            keywordsTag = document.createElement('meta');
            keywordsTag.setAttribute('name', 'keywords');
            document.head.appendChild(keywordsTag);
          }
          const eventType = event.event_type || '';
          const cityName = event.venues?.city || '';
          const keywords = `${eventType}, local events, ${cityName}, the lineup, join the flow`;
          keywordsTag.setAttribute('content', keywords);
          
          // Add social media specific tags with proper SEO structure
          
          // Helper function to ensure meta tags exist
          const ensureMetaTag = (name: string, content: string, type: 'name' | 'property' = 'name') => {
            let tag = document.querySelector(`meta[${type}="${name}"]`);
            if (!tag) {
              tag = document.createElement('meta');
              tag.setAttribute(type, name);
              document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
          };
          
          // Facebook & Open Graph specific tags (which work for WhatsApp too)
          ensureMetaTag('og:title', event.title, 'property');
          ensureMetaTag('og:description', shortDescription, 'property');
          ensureMetaTag('og:image', ogTags.image, 'property');
          ensureMetaTag('og:url', canonicalUrl, 'property');
          ensureMetaTag('og:type', 'website', 'property');
          ensureMetaTag('og:site_name', 'the lineup', 'property');
          
          // Add mobile app capability meta tags to improve sharing experience
          ensureMetaTag('apple-mobile-web-app-capable', 'yes');
          ensureMetaTag('mobile-web-app-capable', 'yes');
          ensureMetaTag('apple-mobile-web-app-title', event.title);
          
          // Force update for sharing platforms by adding a timestamp parameter
          const metaRefresh = document.createElement('meta');
          metaRefresh.name = 'refresh';
          metaRefresh.content = new Date().getTime().toString();
          document.head.appendChild(metaRefresh);
          console.log("Added metadata refresh marker");
        } catch (error) {
          console.error("Error updating meta tags:", error);
        }
      };
      
      updateMetaTags();
    }
    
    // Clean up meta tags when navigating away
    return () => {
      console.log("Cleaning up event meta tags");
      resetToDefaultMetaTags();
      
      // Remove canonical link
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        document.head.removeChild(canonicalLink);
        console.log("Removed canonical link");
      }
      
      // Remove refresh marker
      const metaRefresh = document.querySelector('meta[name="refresh"]');
      if (metaRefresh) {
        document.head.removeChild(metaRefresh);
        console.log("Removed metadata refresh marker");
      }
      
      // Remove mobile-specific meta tags
      ['apple-mobile-web-app-capable', 'mobile-web-app-capable', 'apple-mobile-web-app-title'].forEach(name => {
        const tag = document.querySelector(`meta[name="${name}"]`);
        if (tag) document.head.removeChild(tag);
      });
      
      // Remove social media specific tags
      ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name'].forEach(name => {
        const tag = document.querySelector(`meta[property="${name}"]`);
        if (tag) document.head.removeChild(tag);
      });
    };
  }, [event, getShareImageUrl]);
};
