
/**
 * Extract initials from a name (first letters of first and last name)
 * 
 * @param name Full name to extract initials from
 * @returns String containing the initials (1-2 characters)
 */
export const getInitials = (name: string): string => {
  if (!name) return '?';
  
  const nameParts = name.trim().split(' ');
  
  if (nameParts.length === 1) {
    return nameParts[0].charAt(0).toUpperCase();
  }
  
  return (
    nameParts[0].charAt(0).toUpperCase() + 
    nameParts[nameParts.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Truncates a string if it's longer than the specified length
 * 
 * @param text Text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated string with ellipsis if needed
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

/**
 * Capitalizes the first letter of a string
 * 
 * @param text String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Formats a username for display (adds @ if needed)
 * 
 * @param username Username to format
 * @returns Formatted username
 */
export const formatUsername = (username: string): string => {
  if (!username) return '';
  return username.startsWith('@') ? username : `@${username}`;
};
