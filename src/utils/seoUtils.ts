
import { supabase } from '@/lib/supabase';
import { OgTags } from '@/types/seo';

export const getEventOgTags = async (event: { title: string; description?: string; image_urls?: string[] }): Promise<OgTags> => {
  try {
    console.log("Starting OG tag generation for:", event.title);
    
    // Use any available image from the event, or use the default OG image
    const eventImage = event.image_urls && Array.isArray(event.image_urls) && event.image_urls.length > 0 
      ? event.image_urls[0] 
      : null;
    
    // Process description - ensure it exists and has a reasonable length
    let eventDescription = "";
    if (event.description && event.description.trim() !== '') {
      // Strip HTML tags for the description
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = event.description;
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      eventDescription = plainText.substring(0, 160) + (plainText.length > 160 ? '...' : '');
    } else {
      eventDescription = `Join ${event.title} and connect with locals and friends. Join the flow with the lineup.`;
    }

    console.log("Using event image:", eventImage);
    console.log("Using event description:", eventDescription);

    // If we have an image already, use it instead of generating a new one
    if (eventImage) {
      return {
        title: `${event.title} | the lineup`,
        description: eventDescription,
        image: eventImage,
        type: 'article'
      };
    }

    // Use the default OG image instead of generating a dynamic one
    console.log("No event image available, using default OG image");
    return {
      title: `${event.title} | the lineup`,
      description: eventDescription,
      image: defaultSeoTags.ogImage,
      type: 'article'
    };
  } catch (error) {
    console.error("Error setting up OG tags:", error);
    return {
      title: `${event.title} | the lineup`,
      description: `Join ${event.title} and connect with locals and friends. Join the flow with the lineup.`,
      image: defaultSeoTags.ogImage,
      type: 'article'
    };
  }
};

export const defaultSeoTags = {
  title: "the lineup | Join the Flow",
  description: "Find events, connect with locals and friends, and join the flow of every place you land.",
  ogTitle: "Join the Flow — Connect with Locals and Friends | the lineup",
  ogDescription: "Find events, connect with locals and friends, and join the flow of every place you land.",
  ogImage: "https://vbxhcqlcbusqwsqesoxw.supabase.co/storage/v1/object/public/branding//logo_transp.png",
  tagline: "Join the Flow."
};

// Page-specific SEO tags
export const pageSeoTags = {
  home: {
    title: "Connect Locally and Stay in the Flow | the lineup",
    description: "Find friends, join local events, and stay spontaneous wherever you go. Get into the flow with the lineup."
  },
  events: {
    title: "Discover Local Events & Activities | the lineup",
    description: "Explore a variety of local events, from surf and yoga to community-driven activities. Join exciting experiences and connect with others. Find Your Crew at the-lineup.com.",
    keywords: "local events, surf, yoga, community activities, local experiences, event discovery, lifestyle events, meet people, the lineup, Get into the Flow"
  },
  friends: {
    title: "Connect with People | the lineup",
    description: "Build your community and connect with people. Share experiences and join group activities at the-lineup.com. Find Your Crew.",
    keywords: "connect with friends, community building, group activities, social events, meet people, the lineup"
  },
  profile: {
    title: "Your Profile on the lineup | Connect with Friends, Events & Activities",
    description: "Manage your profile, discover local events, and connect with friends. Customize your preferences and join exciting activities on the-lineup.com. Find Your Crew.",
    keywords: "user profile, discover events, local activities, personal preferences, community events, the lineup"
  }
};

// Update all SEO tags in the document
export const updateDocumentMetaTags = (ogTags: OgTags) => {
  console.log("Updating document meta tags:", ogTags);
  
  // Update page title
  document.title = ogTags.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', ogTags.description);
  } else {
    const newMetaDesc = document.createElement('meta');
    newMetaDesc.name = 'description';
    newMetaDesc.content = ogTags.description;
    document.head.appendChild(newMetaDesc);
  }
  
  // Update OG tags
  const updateOrCreateMetaTag = (property: string, content: string) => {
    const metaTag = document.querySelector(`meta[property="${property}"]`);
    if (metaTag) {
      metaTag.setAttribute('content', content);
      console.log(`Updated ${property} to: ${content}`);
    } else {
      const newMetaTag = document.createElement('meta');
      newMetaTag.setAttribute('property', property);
      newMetaTag.setAttribute('content', content);
      document.head.appendChild(newMetaTag);
      console.log(`Created new ${property} with value: ${content}`);
    }
  };

  // Set all OG tags
  updateOrCreateMetaTag('og:title', ogTags.title);
  updateOrCreateMetaTag('og:description', ogTags.description);
  updateOrCreateMetaTag('og:image', ogTags.image);
  updateOrCreateMetaTag('og:type', ogTags.type || 'website');
  if (ogTags.url) updateOrCreateMetaTag('og:url', ogTags.url);
  
  // Set Twitter card tags
  updateOrCreateMetaTag('twitter:card', 'summary_large_image');
  updateOrCreateMetaTag('twitter:title', ogTags.title);
  updateOrCreateMetaTag('twitter:description', ogTags.description);
  updateOrCreateMetaTag('twitter:image', ogTags.image);

  // Add meta tags specifically for native sharing apps
  updateOrCreateMetaTag('apple-mobile-web-app-title', ogTags.title);
  updateOrCreateMetaTag('application-name', 'the lineup');
};

// Reset to default meta tags
export const resetToDefaultMetaTags = () => {
  document.title = defaultSeoTags.title;
  
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', defaultSeoTags.description);
  
  const ogTitle = document.querySelector('meta[property="og:title"]');
  const ogDesc = document.querySelector('meta[property="og:description"]');
  const ogImage = document.querySelector('meta[property="og:image"]');
  
  if (ogTitle) ogTitle.setAttribute('content', defaultSeoTags.ogTitle);
  if (ogDesc) ogDesc.setAttribute('content', defaultSeoTags.ogDescription);
  if (ogImage) ogImage.setAttribute('content', defaultSeoTags.ogImage);
};
