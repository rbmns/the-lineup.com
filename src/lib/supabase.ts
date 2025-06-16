
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vbxhcqlcbusqwsqesoxw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieGhjcWxjYnVzcXdzcWVzb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NzcsImV4cCI6MjA2MDU4OTU3N30.hoUUYHcdBUgqbKpw-C_pct0bynPFGLnXvIpkneEwTZo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Add some debugging for search queries
const originalFrom = supabase.from;
supabase.from = function(table: string) {
  const query = originalFrom.call(this, table);
  const originalSelect = query.select;
  
  query.select = function(...args: any[]) {
    console.log(`Querying table: ${table} with select:`, args);
    return originalSelect.apply(this, args);
  };
  
  return query;
};
