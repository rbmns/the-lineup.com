
import { SeoMetadata } from '@/types/seo';
import { defaultSeoTags } from '@/utils/seoUtils';

/**
 * Instead of using a table that doesn't exist, we'll use a local storage approach
 * for storing SEO metadata in the client
 */
export const getSeoMetadata = async (): Promise<SeoMetadata | null> => {
  try {
    // Try to get from localStorage
    const storedMetadata = localStorage.getItem('seo_metadata');
    
    if (storedMetadata) {
      return JSON.parse(storedMetadata) as SeoMetadata;
    }
    
    // Return default metadata if nothing is stored
    const defaultMetadata: SeoMetadata = {
      id: 'default',
      title: 'The Lineup - discover local events and casual plans that fit your vibe and connect with others',
      description: 'Find local events and see who\'s joining',
      og_image_url: defaultSeoTags.ogImage,
      favicon_url: null,
      keywords: null,
      author: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store the default metadata
    localStorage.setItem('seo_metadata', JSON.stringify(defaultMetadata));
    
    return defaultMetadata;
  } catch (error) {
    console.error('Exception in getSeoMetadata:', error);
    return null;
  }
};

export const updateSeoMetadata = async (
  updates: Partial<SeoMetadata>
): Promise<{ error: any }> => {
  try {
    // Get current metadata
    const current = await getSeoMetadata() || {
      id: 'default',
      title: 'The Lineup - discover local events and casual plans that fit your vibe and connect with others',
      description: 'Find local events and see who\'s joining',
      og_image_url: defaultSeoTags.ogImage,
      favicon_url: null,
      keywords: null,
      author: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Update with new values
    const updated: SeoMetadata = {
      ...current,
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Store updated metadata
    localStorage.setItem('seo_metadata', JSON.stringify(updated));
    
    return { error: null };
  } catch (error) {
    console.error('Error updating SEO metadata:', error);
    return { error };
  }
};

export const uploadFavicon = async (
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // For now, use a simple URL.createObjectURL approach for local preview
    const url = URL.createObjectURL(file);
    console.log('Created object URL for favicon:', url);
    
    await updateSeoMetadata({ favicon_url: url });
    
    return {
      url,
      error: null,
    };
  } catch (error) {
    console.error('Error in uploadFavicon:', error);
    return {
      url: null,
      error: error as Error,
    };
  }
};

export const uploadOgImage = async (
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    // For now, use a simple URL.createObjectURL approach for local preview
    const url = URL.createObjectURL(file);
    console.log('Created object URL for OG image:', url);
    
    await updateSeoMetadata({ og_image_url: url });
    
    return {
      url,
      error: null,
    };
  } catch (error) {
    console.error('Error in uploadOgImage:', error);
    return {
      url: null,
      error: error as Error,
    };
  }
};

// Initialize SEO metadata with our new default OG image
export const initializeSeoMetadata = async (): Promise<void> => {
  try {
    await updateSeoMetadata({
      title: 'The Lineup - discover local events and casual plans that fit your vibe and connect with others',
      description: 'Find local events and see who\'s joining',
      og_image_url: defaultSeoTags.ogImage,
      favicon_url: 'https://res.cloudinary.com/dita7stkt/image/upload/v1746861996/icon_transp2_zsptuk.svg',
      keywords: 'events, social, lineup, local, friends'
    });
    console.log('SEO metadata initialized successfully');
  } catch (error) {
    console.error('Error initializing SEO metadata:', error);
  }
};
