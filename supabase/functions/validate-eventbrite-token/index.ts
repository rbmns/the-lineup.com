import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// CORS headers to allow cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Validating Eventbrite API token...')
    
    // Step 1: Extract API token from Authorization header or query parameter
    let eventbriteToken: string | null = null
    
    // First, try to get token from Authorization header (Bearer TOKEN format)
    const authHeader = req.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      eventbriteToken = authHeader.substring(7) // Remove 'Bearer ' prefix
      console.log('Token extracted from Authorization header')
    }
    
    // If no token in header, try to get it from URL query parameter
    if (!eventbriteToken) {
      const url = new URL(req.url)
      eventbriteToken = url.searchParams.get('token')
      if (eventbriteToken) {
        console.log('Token extracted from query parameter')
      }
    }
    
    // Step 2: Check if token is provided
    if (!eventbriteToken) {
      console.error('No Eventbrite API token provided')
      return new Response(
        JSON.stringify({ 
          error: 'API token required',
          details: 'Please provide your Eventbrite API token either in the Authorization header (Bearer TOKEN) or as a query parameter (?token=YOUR_TOKEN)'
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Token provided, validating with Eventbrite API...')
    
    // Step 3: Validate the token by making a request to Eventbrite's /users/me/ endpoint
    const eventbriteResponse = await fetch(
      'https://www.eventbriteapi.com/v3/users/me/',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${eventbriteToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    console.log(`Eventbrite API response status: ${eventbriteResponse.status}`)

    // Step 4: Handle different response scenarios
    if (eventbriteResponse.ok) {
      // Token is valid - parse and return user data
      const userData = await eventbriteResponse.json()
      console.log('Token validation successful')
      console.log('User data:', JSON.stringify(userData, null, 2))
      
      return new Response(
        JSON.stringify({
          status: 'success',
          message: 'Token is valid',
          user: userData
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Token is invalid or has issues
      const errorText = await eventbriteResponse.text()
      console.error(`Token validation failed: ${eventbriteResponse.status} ${eventbriteResponse.statusText}`)
      console.error('Eventbrite error response:', errorText)
      
      if (eventbriteResponse.status === 401) {
        // Unauthorized - invalid token
        return new Response(
          JSON.stringify({ 
            error: 'Invalid API token',
            details: 'The provided Eventbrite API token is invalid or has expired. Please check your token and try again.'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else if (eventbriteResponse.status === 403) {
        // Forbidden - token lacks required permissions
        return new Response(
          JSON.stringify({ 
            error: 'Insufficient permissions',
            details: 'The provided API token does not have the required permissions to access user information.'
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      } else {
        // Other Eventbrite API errors
        return new Response(
          JSON.stringify({ 
            error: 'Eventbrite API error',
            details: `Eventbrite API returned an error: ${eventbriteResponse.status} ${eventbriteResponse.statusText}`,
            eventbrite_response: errorText
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

  } catch (error) {
    // Step 5: Handle any unexpected errors (network issues, parsing errors, etc.)
    console.error('Unexpected error in validate-eventbrite-token function:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while validating the token. Please try again later.',
        debug_message: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
