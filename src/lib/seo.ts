
import { supabase } from '@/integrations/supabase/client';
import { SeoMetadata } from '@/types/seo';
import { defaultSeoTags } from '@/utils/seoUtils';

export const getSeoMetadata = async (): Promise<SeoMetadata | null> => {
  try {
    const { data, error } = await supabase
      .from('seo_metadata')
      .select('*')
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching SEO metadata:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception in getSeoMetadata:', error);
    return null;
  }
};

export const updateSeoMetadata = async (
  updates: Partial<SeoMetadata>
): Promise<{ error: any }> => {
  try {
    // First check if any record exists
    const { data: existingData } = await supabase
      .from('seo_metadata')
      .select('id')
      .limit(1)
      .maybeSingle();
    
    const updateData = {
      title: updates.title || 'The Lineup',
      description: updates.description || 'Find local events and see who\'s joining',
      og_image_url: updates.og_image_url || defaultSeoTags.ogImage,
      favicon_url: updates.favicon_url || null,
      keywords: updates.keywords || null,
      author: updates.author || null,
      updated_at: new Date().toISOString()
    };

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('seo_metadata')
        .update(updateData)
        .eq('id', existingData.id);
      
      return { error };
    } else {
      // Insert new record
      const { error } = await supabase
        .from('seo_metadata')
        .insert([updateData]);
      
      return { error };
    }
  } catch (error) {
    console.error('Error updating SEO metadata:', error);
    return { error };
  }
};

export const uploadFavicon = async (
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `favicon-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log(`Starting favicon upload: ${filePath}`);

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('seo')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading favicon:', uploadError);
      throw uploadError;
    }

    console.log('Favicon uploaded successfully:', uploadData);

    const { data } = supabase.storage
      .from('seo')
      .getPublicUrl(filePath);

    console.log('Generated public URL for favicon:', data.publicUrl);
    
    await updateSeoMetadata({ favicon_url: data.publicUrl });
    
    return {
      url: data.publicUrl,
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
    const fileExt = file.name.split('.').pop();
    const fileName = `og-image-${Date.now()}.${fileExt}`;
    const filePath = fileName;

    console.log(`Starting OG image upload: ${filePath}`);

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('seo')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error('Error uploading OG image:', uploadError);
      throw uploadError;
    }

    console.log('OG image uploaded successfully:', uploadData);

    const { data } = supabase.storage
      .from('seo')
      .getPublicUrl(filePath);

    console.log('Generated public URL for OG image:', data.publicUrl);
    
    await updateSeoMetadata({ og_image_url: data.publicUrl });
    
    return {
      url: data.publicUrl,
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
      title: 'The Lineup',
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

