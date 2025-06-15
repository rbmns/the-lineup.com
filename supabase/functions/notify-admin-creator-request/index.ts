
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!resendApiKey) {
    console.error("RESEND_API_KEY is not set.");
    return new Response(JSON.stringify({ error: "Server configuration error: missing API key." }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
  const resend = new Resend(resendApiKey);

  try {
    const { username, user_email, reason, contact_email, contact_phone }: CreatorRequestPayload = await req.json();

    // IMPORTANT: Replace with your admin email address.
    const adminEmail = "admin@example.com"; 

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
      <p>Please review this request in the admin panel.</p>
    `;

    const { data, error } = await resend.emails.send({
      from: "The Line-Up <onboarding@resend.dev>", // onboarding@resend.dev is a default for testing
      to: [adminEmail],
      subject: `New Creator Request from ${username}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      throw new Error(`Failed to send notification email. ${JSON.stringify(error)}`);
    }

    console.log("Admin notification email sent successfully:", data);

    return new Response(JSON.stringify({ message: "Notification sent successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("Error in notify-admin-creator-request function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
