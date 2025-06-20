import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    console.log('Fetching public Eventbrite events...')
    
    // Extract API token from Authorization header or query parameter
    let eventbriteToken: string | null = null
    
    // First, try to get token from Authorization header (Bearer TOKEN format)
    const authHeader = req.headers.get('Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      eventbriteToken = authHeader.substring(7) // Remove 'Bearer ' prefix
      console.log('Token extracted from Authorization header')
    }
    
    // Parse URL to get query parameters
    const url = new URL(req.url)
    
    // If no token in header, try to get it from URL query parameter
    if (!eventbriteToken) {
      eventbriteToken = url.searchParams.get('token')
      if (eventbriteToken) {
        console.log('Token extracted from query parameter')
      }
    }
    
    // Check if token is provided
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

    // Build the Eventbrite API search URL with query parameters
    const eventbriteSearchUrl = new URL('https://www.eventbriteapi.com/v3/events/search/')
    
    // Map query parameters to Eventbrite API parameters
    const location = url.searchParams.get('location')
    const q = url.searchParams.get('q')
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')
    
    if (location) {
      eventbriteSearchUrl.searchParams.set('location.address', location)
      console.log(`Location filter: ${location}`)
    }
    
    if (q) {
      eventbriteSearchUrl.searchParams.set('q', q)
      console.log(`Keyword search: ${q}`)
    }
    
    if (startDate) {
      eventbriteSearchUrl.searchParams.set('start_date.range_start', startDate)
      console.log(`Start date filter: ${startDate}`)
    }
    
    if (endDate) {
      eventbriteSearchUrl.searchParams.set('start_date.range_end', endDate)
      console.log(`End date filter: ${endDate}`)
    }
    
    // Always expand venue and logo for more complete event data
    eventbriteSearchUrl.searchParams.set('expand', 'venue,logo')
    
    console.log(`Making request to: ${eventbriteSearchUrl.toString()}`)
    
    // Make the request to Eventbrite API
    const eventbriteResponse = await fetch(eventbriteSearchUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${eventbriteToken}`,
        'Content-Type': 'application/json',
      },
    })

    console.log(`Eventbrite API response status: ${eventbriteResponse.status}`)

    // Handle different response scenarios
    if (eventbriteResponse.ok) {
      // Parse and return the successful response
      const eventbriteData = await eventbriteResponse.json()
      console.log(`Successfully fetched ${eventbriteData.events?.length || 0} events`)
      
      return new Response(
        JSON.stringify({
          status: 'success',
          data: eventbriteData,
          filters_applied: {
            location: location || null,
            keyword: q || null,
            start_date: startDate || null,
            end_date: endDate || null
          }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      // Handle API errors
      const errorText = await eventbriteResponse.text()
      console.error(`Eventbrite API error: ${eventbriteResponse.status} ${eventbriteResponse.statusText}`)
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
            details: 'The provided API token does not have the required permissions to search for events.'
          }),
          { 
            status: 403, 
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
            status: eventbriteResponse.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
    }

  } catch (error) {
    // Handle any unexpected errors (network issues, parsing errors, etc.)
    console.error('Unexpected error in fetch-public-eventbrite-events function:', error)
    console.error('Error details:', error.message)
    console.error('Error stack:', error.stack)
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: 'An unexpected error occurred while fetching events. Please try again later.',
        debug_message: error.message
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
