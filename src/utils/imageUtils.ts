
/**
 * Helper utility to process image URLs and ensure they are always returned as string arrays
 * This is crucial for maintaining avatar_url compatibility across the site
 */
export const processImageUrls = (imageUrlsInput: any): string[] => {
  // If no input or undefined, return empty array
  if (!imageUrlsInput) {
    return [];
  }
  
  // If already an array, filter out non-string values and ensure we have valid URLs
  if (Array.isArray(imageUrlsInput)) {
    return imageUrlsInput.filter(url => typeof url === 'string' && url.trim().length > 0);
  }
  
  // If it's a string, return as a single-item array
  if (typeof imageUrlsInput === 'string' && imageUrlsInput.trim().length > 0) {
    return [imageUrlsInput.trim()];
  }
  
  // For any other type, return empty array
  return [];
};
