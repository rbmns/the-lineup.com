
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbxhcqlcbusqwsqesoxw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZieGhjcWxjYnVzcXdzcWVzb3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwMTM1NzcsImV4cCI6MjA2MDU4OTU3N30.hoUUYHcdBUgqbKpw-C_pct0bynPFGLnXvIpkneEwTZo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
