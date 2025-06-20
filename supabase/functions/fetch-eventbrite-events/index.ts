
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
    const eventbriteToken = Deno.env.get('EVENTBRITE_API_TOKEN')
    
    if (!eventbriteToken) {
      console.error('EVENTBRITE_API_TOKEN not found in environment variables')
      return new Response(
        JSON.stringify({ error: 'Eventbrite API token not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetching events from Eventbrite API...')
    
    // First, let's try to get user info to validate the token
    const userResponse = await fetch(
      'https://www.eventbriteapi.com/v3/users/me/',
      {
        headers: {
          'Authorization': `Bearer ${eventbriteToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!userResponse.ok) {
      console.error(`Eventbrite user API error: ${userResponse.status} ${userResponse.statusText}`)
      const errorText = await userResponse.text()
      console.error('User API error response:', errorText)
      
      if (userResponse.status === 401) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid Eventbrite API token',
            details: 'Please check your API token and make sure it has the correct permissions' 
          }),
          { 
            status: 401, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        )
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to validate Eventbrite API token',
          details: errorText 
        }),
        { 
          status: userResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const userData = await userResponse.json()
    console.log('User data received:', JSON.stringify(userData, null, 2))
    
    // Try different event endpoints to find one that works
    const eventEndpoints = [
      'https://www.eventbriteapi.com/v3/users/me/events/?expand=venue,logo&status=live',
      'https://www.eventbriteapi.com/v3/users/me/events/?expand=venue,logo',
      `https://www.eventbriteapi.com/v3/users/${userData.id}/events/?expand=venue,logo&status=live`,
      `https://www.eventbriteapi.com/v3/users/${userData.id}/events/?expand=venue,logo`
    ]

    let eventbriteData = null
    let successfulEndpoint = null

    for (const endpoint of eventEndpoints) {
      console.log(`Trying endpoint: ${endpoint}`)
      
      const eventbriteResponse = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${eventbriteToken}`,
          'Content-Type': 'application/json',
        },
      })

      if (eventbriteResponse.ok) {
        eventbriteData = await eventbriteResponse.json()
        successfulEndpoint = endpoint
        console.log(`Success with endpoint: ${endpoint}`)
        break
      } else {
        console.error(`Failed with endpoint ${endpoint}: ${eventbriteResponse.status} ${eventbriteResponse.statusText}`)
        const errorText = await eventbriteResponse.text()
        console.error('Error response:', errorText)
      }
    }

    if (!eventbriteData) {
      console.error('All event endpoints failed')
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch events from any Eventbrite endpoint',
          details: 'All attempted endpoints returned errors. This might be a permissions issue or your account may not have any events.',
          user_id: userData.id
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Eventbrite events data received from ${successfulEndpoint}:`, JSON.stringify(eventbriteData, null, 2))

    // Transform Eventbrite events to the requested format
    const transformedEvents = eventbriteData.events?.map((event: any) => ({
      title: event.name?.text || 'Untitled Event',
      description: event.description?.text || '',
      start_time: event.start?.utc || null,
      end_time: event.end?.utc || null,
      location: event.venue?.name || event.venue?.address?.localized_address_display || '',
      image_url: event.logo?.url || null,
      url: event.url || '',
      source: 'eventbrite',
      tags: []
    })) || []

    console.log(`Transformed ${transformedEvents.length} events`)
    
    return new Response(
      JSON.stringify({ 
        events: transformedEvents,
        count: transformedEvents.length,
        user: userData.name || userData.email || 'Unknown user',
        endpoint_used: successfulEndpoint
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in fetch-eventbrite-events function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
