
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { renderJpeg } from "https://deno.land/x/resvg_wasm@0.2.0/mod.ts";
import { html } from "https://deno.land/x/html@v1.2.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default OG image URL
const DEFAULT_OG_IMAGE = "https://vbxhcqlcbusqwsqesoxw.supabase.co/storage/v1/object/public/branding//OG%20Image.png";

// Handle CORS preflight requests
const handleCors = (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  return null;
};

// Template for the OG image
const generateOgImageTemplate = (title: string, description: string) => {
  // Truncate long titles and descriptions to fit
  const truncatedTitle = title && title.length > 45 ? 
    `${title.substring(0, 45)}...` : title;

  const truncatedDesc = description && description.length > 80 ? 
    `${description.substring(0, 80)}...` : description;

  return html`
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="1200" height="630" fill="#F8FAFC"/>
      
      <!-- Content container -->
      <rect x="60" y="60" width="1080" height="510" rx="12" fill="#FFFFFF" stroke="#E5E7EB" stroke-width="1"/>
      
      <!-- Logo and branding -->
      <text x="100" y="130" font-family="Inter, system-ui, sans-serif" font-size="40" font-weight="700" fill="#000000">thelineup</text>
      
      <!-- Main title -->
      <text x="100" y="250" font-family="Inter, system-ui, sans-serif" font-size="60" font-weight="800" fill="#000000">${truncatedTitle}</text>
      
      <!-- Description -->
      <text x="100" y="320" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="400" fill="#4B5563">${truncatedDesc || "Join us for this event"}</text>
      
      <!-- Footer - Catchphrase -->
      <text x="100" y="520" font-family="Inter, system-ui, sans-serif" font-size="24" font-weight="600" fill="#6B7280">Get in the Flow, Wherever You Go</text>
    </svg>
  `;
};

// Generate and save an image to storage
const generateOgImage = async (title: string, description: string): Promise<string> => {
  console.log("Generating OG image requested with:", { title, description });
  
  // IMPORTANT: Return the default OG image directly
  // We're prioritizing the default OG image rather than generating a dynamic one
  return DEFAULT_OG_IMAGE;
  
  /* Original dynamic generation code kept for reference but not used
  try {
    const svgString = generateOgImageTemplate(title, description);
    const imageBuffer = await renderJpeg(svgString);
    
    // Get storage client
    const bucketName = "branding";
    const fileName = `og_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.jpg`;

    // Upload the image to Supabase storage
    const { data, error } = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${bucketName}/${fileName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
          "x-upsert": "true",
        },
        body: imageBuffer,
      }
    ).then(res => res.json());

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    // Return the public URL of the image
    return `${Deno.env.get("SUPABASE_URL")}/storage/v1/object/public/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("Error generating OG image:", error);
    return "";
  }
  */
};

serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Parse request body
    const { title, description } = await req.json();
    
    if (!title) {
      return new Response(
        JSON.stringify({ error: "Title is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Now we just return the default OG image URL
    const imageUrl = DEFAULT_OG_IMAGE;

    return new Response(
      JSON.stringify({ 
        url: imageUrl,
        success: Boolean(imageUrl)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        url: DEFAULT_OG_IMAGE, // Return default OG image even on error
        success: true
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
