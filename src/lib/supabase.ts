
import { createClient } from '@supabase/supabase-js';

// Use the hardcoded values from integrations/supabase/client.ts since we're having issues with env vars
const supabaseUrl = 'https://vbxhcqlcbusqwsqesoxw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieGhjcWxjYnVzcXdzcWVzb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NzcsImV4cCI6MjA2MDU4OTU3N30.hoUUYHcdBUgqbKpw-C_pct0bynPFGLnXvIpkneEwTZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Helper function to make typed Supabase queries
 * Use this to get proper type inference for table operations
 */
export function safelyQueryTable<T = any>(tableName: string) {
  return supabase.from(tableName) as unknown as T;
}

/**
 * Helper to safely execute Supabase queries with proper error handling
 */
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T | null> {
  try {
    const { data, error } = await queryFn();
    if (error) {
      console.error('Supabase query error:', error);
      return null;
    }
    return data;
  } catch (e) {
    console.error('Exception during Supabase query:', e);
    return null;
  }
}

/**
 * Type-safe equals operation for Supabase
 */
export function safeEqFilter<T>(query: any, column: string, value: any): T {
  try {
    // Force the typecasting for Supabase parameter
    const typedValue = value as any;
    return query.eq(column, typedValue) as T;
  } catch (error) {
    console.error(`Error applying eq filter on ${column}:`, error);
    return query as T;
  }
}
