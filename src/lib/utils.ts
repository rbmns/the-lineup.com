import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely renders HTML content with basic sanitization
 * @param html The HTML string to render
 * @returns A sanitized dangerouslySetInnerHTML object
 */
export const renderHTML = (html: string | undefined | null) => {
  if (!html) return { __html: '' };
  
  try {
    // Basic sanitization for script tags and event handlers
    // More comprehensive sanitization should be implemented for production
    const sanitized = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/on\w+='[^']*'/gi, ''); // Remove event handlers with single quotes
      
    return { __html: sanitized };
  } catch (error) {
    console.error('Error rendering HTML:', error);
    return { __html: '' };
  }
};
