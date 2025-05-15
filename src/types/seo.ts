
export interface SeoMetadata {
  id: string;
  title: string;
  description: string;
  og_image_url: string | null;
  favicon_url: string | null;
  keywords: string | null;
  author: string | null;
  created_at: string;
  updated_at: string;
}

// Additional fields for social sharing
export interface SocialShare {
  title: string;
  text: string;
  url: string;
  image?: string;
  hashTags?: string[];
}

// Type for Open Graph tags
export interface OgTags {
  title: string;
  description: string;
  image: string;
  url?: string;
  type?: string;
}
