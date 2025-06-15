
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// IMPORTANT: Replace this with your admin email address
const ADMIN_EMAIL = 'admin@example.com'; 

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

serve(async (req) => {
  // This is needed for browser-based invocations.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: CreatorRequestPayload = await req.json();
    console.log("Received payload for email notification:", payload);

    const { data, error } = await resend.emails.send({
      // IMPORTANT: You need to verify this domain in your Resend account.
      from: "The Line-Up <noreply@the-lineup.com>",
      to: [ADMIN_EMAIL],
      subject: `New Creator Request from ${payload.username}`,
      html: `
        <h1>New Creator Request</h1>
        <p>A new request to become an event creator has been submitted.</p>
        <h2>User Details:</h2>
        <ul>
          <li><strong>Username:</strong> ${payload.username}</li>
          <li><strong>Email:</strong> ${payload.user_email}</li>
        </ul>
        <h2>Request Details:</h2>
        <p><strong>Reason:</strong> ${payload.reason}</p>
        <h3>Contact Info Provided:</h3>
        <ul>
          <li><strong>Contact Email:</strong> ${payload.contact_email || 'Not provided'}</li>
          <li><strong>Contact Phone:</strong> ${payload.contact_phone || 'Not provided'}</li>
        </ul>
        <p>You can approve or deny this request from the Creator Requests manager in the app.</p>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log("Email sent successfully:", data);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (err) {
    console.error("Handler error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
