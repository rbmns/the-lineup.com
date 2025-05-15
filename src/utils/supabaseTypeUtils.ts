
/**
 * Utility functions to safely handle Supabase types
 */

/**
 * Type-safe parameter for Supabase queries
 * This helps when passing string IDs to Supabase where it expects a specific type
 */
export function asTypedParam<T>(value: string | number | boolean | null | undefined): any {
  // Force type casting for Supabase query parameters
  return value as unknown as T;
}

/**
 * Forcefully type cast a value to a specific type
 * Use carefully, only when you know the actual type matches
 */
export function forceTypeCast<T>(value: any): T {
  return value as unknown as T;
}

/**
 * Helper for safely handling response data with proper typing
 */
export function handleResponseData<T>(data: any): T | null {
  if (!data) return null;
  if (typeof data === 'object' && 'error' in data) return null;
  return data as T;
}

/**
 * Type assertion for update operations in Supabase
 */
export function asUpdateParam<T>(data: any): any {
  return data as unknown as T;
}

/**
 * Type assertion for insert operations in Supabase
 */
export function asInsertParam<T>(data: any): any {
  return data as unknown as T;
}

/**
 * Safe check to determine if a response has data before processing
 */
export function isValidResponse(response: any): boolean {
  return response && 
         !response.error && 
         response.data !== null && 
         typeof response.data === 'object';
}

/**
 * Type-safe equals operation for Supabase
 */
export function asEqParam<T = any>(value: any): T {
  return value as unknown as T;
}

/**
 * Safely get a property from an object with default value
 */
export function safeGet<T>(obj: any, key: string, defaultValue: T): T {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
}

/**
 * Safely get a nested property from an object with default value
 */
export function safeGetNested<T>(obj: any, path: string[], defaultValue: T): T {
  let current = obj;
  for (const key of path) {
    if (!current || typeof current !== 'object') return defaultValue;
    current = current[key];
  }
  return current !== undefined ? current : defaultValue;
}

/**
 * Check if an object has a specific property
 */
export function hasProperty(obj: any, key: string): boolean {
  return obj && typeof obj === 'object' && key in obj;
}

/**
 * Function to safely extract user profiles from Supabase responses
 */
export function toUserProfiles(data: any): any[] {
  if (!data || data.error) return [];
  
  try {
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error processing user profiles:', error);
    return [];
  }
}

/**
 * Safe spread operator for potentially error objects
 * Helps avoid "Spread types may only be created from object types" error
 */
export function safeSpread<T>(obj: any): T {
  if (!obj || typeof obj !== 'object' || 'error' in obj) {
    return {} as T;
  }
  return obj as T;
}
