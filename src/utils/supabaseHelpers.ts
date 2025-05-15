
import { supabase } from '@/lib/supabase';
import { asEqParam, forceTypeCast } from './supabaseTypeUtils';

/**
 * Create a type-safe query for Supabase
 */
export function createSafeQuery(tableName: string) {
  return supabase.from(tableName);
}

/**
 * Execute a Supabase query with safe error handling and result typing
 */
export async function executeSafeQuery<T>(queryFn: () => Promise<{data: any, error: any}>): Promise<T[] | null> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }
    
    return data as T[];
  } catch (error) {
    console.error('Error executing Supabase query:', error);
    return null;
  }
}

/**
 * Type-safe equals filter for Supabase queries
 */
export function safeEquals<T = any>(query: any, column: string, value: any): any {
  return query.eq(column, asEqParam<T>(value));
}

/**
 * Type-safe in filter for Supabase queries
 */
export function safeIn<T = any>(query: any, column: string, values: any[]): any {
  return query.in(column, values.map(v => asEqParam<T>(v)));
}

/**
 * Process the result of a Supabase query with a mapper function
 */
export function processQueryResult<T, R>(data: any[] | null, mapperFn: (item: any) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(item => mapperFn(item)).filter(Boolean);
}

/**
 * Safely extract related data from Supabase nested objects
 */
export function extractRelatedData(data: any, path: string[]): any | null {
  try {
    let current = data;
    
    for (const segment of path) {
      if (!current || typeof current !== 'object') return null;
      current = current[segment];
    }
    
    return current;
  } catch (error) {
    console.error('Error extracting related data:', error);
    return null;
  }
}

/**
 * Safely type-cast Supabase response to expected type
 */
export function castSupabaseResult<T>(data: any): T | null {
  if (!data) return null;
  
  try {
    return forceTypeCast<T>(data);
  } catch (error) {
    console.error('Error casting Supabase result:', error);
    return null;
  }
}

/**
 * Convert a string to a URL-friendly slug
 * Format: YYYY-MM-DD-event-title (date first, then the title)
 */
export function createSlug(text: string, date?: Date | string): string {
  if (!text) return '';
  
  // Process the title part
  const titleSlug = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with dashes
    .replace(/-+/g, '-')      // Replace multiple dashes with a single dash
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing dashes
  
  // If date is provided, prepend it to the slug
  if (date) {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (!isNaN(dateObj.getTime())) {
      const formattedDate = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      return `${formattedDate}-${titleSlug}`;
    }
  }
  
  return titleSlug;
}

/**
 * Normalize existing slugs to ensure they use dashes not underscores
 */
export function normalizeSlug(slug: string): string {
  if (!slug) return '';
  
  return slug.replace(/_/g, '-');
}
