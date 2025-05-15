
/**
 * Helper utility to process image URLs and ensure they are always returned as string arrays
 */
export const processImageUrls = (imageUrlsInput: any): string[] => {
  // If no input or undefined, return empty array
  if (!imageUrlsInput) {
    return [];
  }
  
  // If already an array, filter out non-string values
  if (Array.isArray(imageUrlsInput)) {
    return imageUrlsInput.filter(url => typeof url === 'string');
  }
  
  // If it's a string, return as a single-item array
  if (typeof imageUrlsInput === 'string') {
    return [imageUrlsInput];
  }
  
  // For any other type, return empty array
  return [];
};
