
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// This is your Resend API key. It's recommended to set this in your Supabase project's Edge Function secrets.
const resendApiKey = Deno.env.get("RESEND_API_KEY");

// This is a comma-separated list of admin email addresses to notify.
// You must set this in your Supabase project's Edge Function secrets.
// Go to Project Settings > Edge Functions and add a new secret called ADMIN_EMAILS.
// e.g., "admin1@example.com,admin2@example.com"
const adminEmailsEnv = Deno.env.get("ADMIN_EMAILS");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreatorRequestPayload {
  username: string;
  user_email: string;
  reason: string;
  contact_email?: string;
  contact_phone?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Validate environment variables
  if (!resendApiKey) {
    console.error("Aborting: RESEND_API_KEY environment variable is not set.");
    return new Response(JSON.stringify({ error: "Server configuration error: Missing Resend API key." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
  
  if (!adminEmailsEnv) {
    console.error("Aborting: ADMIN_EMAILS environment variable is not set.");
    return new Response(JSON.stringify({ error: "Server configuration error: Missing admin email addresses." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const resend = new Resend(resendApiKey);
  const adminEmailList = adminEmailsEnv.split(',').map(email => email.trim()).filter(Boolean);

  if (adminEmailList.length === 0) {
    console.error("Aborting: ADMIN_EMAILS environment variable is empty or invalid.");
    return new Response(JSON.stringify({ error: "Server configuration error: No valid admin email addresses found." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    const payload: CreatorRequestPayload = await req.json();
    const { username, user_email, reason, contact_email, contact_phone } = payload;
    
    console.log(`Received creator request from user: ${username} (${user_email})`);

    const emailHtml = `
      <h1>New Creator Access Request</h1>
      <p>A new request for creator access has been submitted.</p>
      <h2>User Details:</h2>
      <ul>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Email:</strong> ${user_email}</li>
      </ul>
      <h2>Request Details:</h2>
      <p><strong>Reason:</strong> ${reason}</p>
      <h3>Contact Information:</h3>
      <ul>
        <li><strong>Contact Email:</strong> ${contact_email || 'Not provided'}</li>
        <li><strong>Contact Phone:</strong> ${contact_phone || 'Not provided'}</li>
      </ul>
      <p>Please review this request in the admin panel of your application.</p>
    `;

    // The 'from' address must be from a domain you have verified in your Resend account.
    // 'onboarding@resend.dev' is a default for testing, but you should replace
    // 'The Line-Up' with your app name and use your own verified domain for production.
    const { data, error } = await resend.emails.send({
      from: "The Line-Up <onboarding@resend.dev>", 
      to: adminEmailList,
      subject: `New Creator Request from ${username}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to send notification email via Resend.`);
    }

    console.log(`Admin notification email sent successfully to: ${adminEmailList.join(', ')}.`, data);

    return new Response(JSON.stringify({ message: "Notification sent successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in notify-admin-creator-request function:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
