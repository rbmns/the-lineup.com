
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
    
    const eventbriteResponse = await fetch(
      'https://www.eventbriteapi.com/v3/users/me/events/?expand=venue,logo&status=live',
      {
        headers: {
          'Authorization': `Bearer ${eventbriteToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!eventbriteResponse.ok) {
      console.error(`Eventbrite API error: ${eventbriteResponse.status} ${eventbriteResponse.statusText}`)
      const errorText = await eventbriteResponse.text()
      console.error('Error response:', errorText)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch events from Eventbrite',
          details: errorText 
        }),
        { 
          status: eventbriteResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const eventbriteData = await eventbriteResponse.json()
    console.log('Eventbrite data received:', JSON.stringify(eventbriteData, null, 2))

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
        count: transformedEvents.length 
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
