
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0';

interface TrackSearchParams {
  query: string;
  resultId?: string;
  resultType?: string;
  clicked?: boolean;
  userId?: string;
}

// CORS headers for the function
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  try {
    // Create a Supabase client with the auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );
    
    // Get the session or get the user ID from the request if available
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();
    
    // Parse the request body
    const { query, resultId, resultType, clicked = false, userId = null } = await req.json() as TrackSearchParams;
    
    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    // Use the session user id or the explicitly provided user id
    const userIdToUse = session?.user?.id || userId;
    
    // Insert the search tracking data
    const { error } = await supabaseClient
      .from('search_tracking')
      .insert({
        query,
        result_id: resultId,
        result_type: resultType,
        clicked,
        user_id: userIdToUse,
        timestamp: new Date().toISOString()
      });
    
    if (error) {
      console.error('Error tracking search:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (error) {
    console.error('Error in track-search function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
});
