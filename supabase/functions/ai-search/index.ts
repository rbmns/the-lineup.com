import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SearchFilters {
  category: string[];
  tags: string[];
  vibe: string;
  date_range: string;
  city: string;
  region: string;
}

interface SearchResponse {
  strict_filters: SearchFilters;
  fallback_filters: SearchFilters;
  feedback: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI search function called');
    
    // Parse the request body
    let body;
    try {
      body = await req.json();
      console.log('Request body:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      return new Response(
        JSON.stringify({ 
          strict_filters: {
            category: ['Social', 'Beach', 'Entertainment'],
            tags: [],
            vibe: 'relaxed',
            date_range: '',
            city: '',
            region: 'Noord-Holland'
          },
          fallback_filters: {
            category: ['Party', 'Fitness', 'Music'],
            tags: [],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: 'Noord-Holland'
          },
          feedback: "Browse our featured events and activities happening near you."
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { query } = body;
    
    if (!query) {
      return new Response(
        JSON.stringify({ 
          strict_filters: {
            category: ['Social', 'Entertainment', 'Beach'],
            tags: [],
            vibe: 'relaxed',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Party', 'Fitness', 'Outdoor'],
            tags: [],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "Browse our featured events. Discover popular activities happening near you."
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!openRouterApiKey) {
      console.error('OPENROUTER_API_KEY is not set');
      return new Response(
        JSON.stringify({ 
          strict_filters: {
            category: ['Social', 'Beach', 'Entertainment'],
            tags: [],
            vibe: 'relaxed',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Party', 'Outdoor', 'Fitness'],
            tags: [],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "Browse our top recommendations. Check out beach events and social gatherings happening soon."
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simple cases for common searches without needing AI
    const lowercasedQuery = query.toLowerCase().trim();
    
    // Special case for yoga searches
    if (lowercasedQuery === 'yoga' || lowercasedQuery.includes('yoga')) {
      return new Response(
        JSON.stringify({
          strict_filters: {
            category: ['Yoga'],
            tags: ['wellness', 'relax'],
            vibe: 'calm',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Meditation', 'Fitness', 'Workshop'],
            tags: ['wellness', 'mindfulness'],
            vibe: 'relaxed',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "Found yoga events and wellness activities. Browse options suitable for relaxation and mindfulness."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Special case for relaxation searches
    if (lowercasedQuery === 'relax' || lowercasedQuery.includes('relax') || 
        lowercasedQuery === 'relaxation' || lowercasedQuery.includes('relaxation')) {
      return new Response(
        JSON.stringify({
          strict_filters: {
            category: ['Yoga', 'Meditation'],
            tags: ['wellness', 'relax'],
            vibe: 'calm',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Workshop', 'Fitness', 'Beach'],
            tags: ['wellness', 'mindfulness'],
            vibe: 'relaxed',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "Showing relaxation and wellness events that will help you unwind and de-stress."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (lowercasedQuery === 'surf' || lowercasedQuery === 'surfing') {
      return new Response(
        JSON.stringify({
          strict_filters: {
            category: ['Surf'],
            tags: ['water sports'],
            vibe: 'active',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Water Sports', 'Fitness', 'Beach'],
            tags: ['outdoor'],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "Showing surf experiences and related beach activities. Explore options suitable for all skill levels."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchPrompt = (query: string) => `
You are a smart, friendly event search assistant. Convert natural language search queries into structured JSON with two sets of filters:
1. strict_filters: Filters that match the query exactly
2. fallback_filters: Broader filters to use if no exact match is found

The query might be in English or Dutch. Understand and interpret both languages, but ALWAYS provide category names and responses in English.

Return a JSON object with this exact structure:
{
  "strict_filters": {
    "category": [],    // Event categories that exactly match the query
    "tags": [],        // Relevant tags for the event
    "vibe": "",        // The atmosphere/mood of the event
    "date_range": "",  // Specific time frame mentioned
    "city": "",        // Specific city mentioned
    "region": ""       // Region (e.g., Noord-Holland, Zuid-Holland)
  },
  "fallback_filters": {
    "category": [],    // Related categories
    "tags": [],        // Related tags
    "vibe": "",        // Similar vibes/moods
    "date_range": "",  // Broader time frame
    "city": "",        // Nearby cities
    "region": ""       // Same or neighboring regions
  },
  "feedback": ""       // Short, friendly message about the search results
}

Rules:
1. Always include at least 2-3 categories in both filter sets
2. Keep feedback concise and friendly (max 2 sentences)
3. First sentence should mention if exact matches were found or if showing similar events
4. If no specific date is mentioned, use "next 7 days" in fallback_filters
5. For Dutch cities, always include the region

Example input: "Any surf lessons in Zandvoort this weekend?"
Example output:
{
  "strict_filters": {
    "category": ["Surf", "Workshop"],
    "tags": ["lessons", "beginner"],
    "vibe": "active",
    "date_range": "this weekend",
    "city": "Zandvoort",
    "region": "Noord-Holland"
  },
  "fallback_filters": {
    "category": ["Water Sports", "Beach", "Outdoor"],
    "tags": ["sports", "group activity"],
    "vibe": "energetic",
    "date_range": "next 7 days",
    "city": "Zandvoort",
    "region": "Noord-Holland"
  },
  "feedback": "Looking for surf lessons in Zandvoort this weekend. Also showing other water sports and beach activities."
}

Input: "${query}"
Respond ONLY with a valid JSON object following the exact structure above.
Keep the feedback concise and friendly, mentioning if showing exact matches or similar events.
`;

    console.log('Sending request to OpenRouter AI with prompt');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that generates structured JSON search filters from natural language queries.' },
          { role: 'user', content: searchPrompt(query) }
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status}`, errorText);
      return new Response(
        JSON.stringify({ 
          strict_filters: {
            category: ['Beach', 'Social', 'Entertainment'],
            tags: [],
            vibe: 'relaxed',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Party', 'Outdoor', 'Fitness'],
            tags: [],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "No exact matches found for your search. Showing popular events and activities instead."
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('API response:', JSON.stringify(data, null, 2));
    
    if (!data.choices || !data.choices.length || !data.choices[0].message?.content) {
      return new Response(
        JSON.stringify({ 
          strict_filters: {
            category: ['Fitness', 'Social', 'Entertainment'],
            tags: [],
            vibe: 'relaxed',
            date_range: '',
            city: '',
            region: ''
          },
          fallback_filters: {
            category: ['Beach', 'Outdoor', 'Party'],
            tags: [],
            vibe: 'energetic',
            date_range: 'next 7 days',
            city: '',
            region: ''
          },
          feedback: "No exact matches found for your search. Showing fitness events and social gatherings nearby instead."
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse and validate the AI response
    let parsedResponse: SearchResponse;
    try {
      parsedResponse = JSON.parse(data.choices[0].message.content);
      console.log('Parsed response:', parsedResponse);
      
      // Ensure feedback exists and is helpful
      if (!parsedResponse.feedback) {
        parsedResponse.feedback = "No exact matches found for your search. Showing related events that might interest you.";
      }
      
      // Ensure strict_filters has categories
      if (!parsedResponse.strict_filters.category || parsedResponse.strict_filters.category.length === 0) {
        parsedResponse.strict_filters.category = ['Social', 'Entertainment'];
      }
      
      // Ensure fallback_filters has categories and date_range
      if (!parsedResponse.fallback_filters.category || parsedResponse.fallback_filters.category.length === 0) {
        parsedResponse.fallback_filters.category = ['Party', 'Outdoor', 'Fitness'];
      }
      
      if (!parsedResponse.fallback_filters.date_range) {
        parsedResponse.fallback_filters.date_range = 'next 7 days';
      }
      
    } catch (error) {
      console.error('Error parsing AI response:', error);
      console.error('Raw content:', data.choices[0].message.content);
      
      parsedResponse = {
        strict_filters: {
          category: ['Social', 'Entertainment'],
          tags: [],
          vibe: 'relaxed',
          date_range: '',
          city: '',
          region: ''
        },
        fallback_filters: {
          category: ['Party', 'Outdoor', 'Fitness'],
          tags: [],
          vibe: 'energetic',
          date_range: 'next 7 days',
          city: '',
          region: ''
        },
        feedback: "No exact matches found for your search. Showing popular events and activities instead."
      };
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI search function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Unknown error occurred',
        strict_filters: {
          category: ['Social', 'Entertainment', 'Beach'],
          tags: [],
          vibe: 'relaxed',
          date_range: '',
          city: '',
          region: ''
        },
        fallback_filters: {
          category: ['Party', 'Fitness', 'Workshop'],
          tags: [],
          vibe: 'energetic',
          date_range: 'next 7 days',
          city: '',
          region: ''
        },
        feedback: "No exact matches for your search. Showing popular events and activities instead."
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
