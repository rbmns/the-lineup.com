
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@3.4.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Note: Change this to your admin's email address.
const ADMIN_EMAIL = "admin@example.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CreatorRequest {
  user_id: string;
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

  try {
    const { request }: { request: CreatorRequest } = await req.json();

    const { data, error } = await resend.emails.send({
      from: "The Lineup <onboarding@resend.dev>",
      to: [ADMIN_EMAIL],
      subject: "New Event Creator Request",
      html: `
        <h1>New Event Creator Request</h1>
        <p>A user has requested to become an event creator.</p>
        <h2>User Details</h2>
        <ul>
          <li><strong>User ID:</strong> ${request.user_id}</li>
          <li><strong>Username:</strong> ${request.username}</li>
          <li><strong>User Email:</strong> ${request.user_email}</li>
        </ul>
        <h2>Request Details</h2>
        <p><strong>Reason:</strong></p>
        <p>${request.reason}</p>
        <h3>Contact Information</h3>
        <ul>
          <li><strong>Contact Email:</strong> ${request.contact_email || 'Not provided'}</li>
          <li><strong>Contact Phone:</strong> ${request.contact_phone || 'Not provided'}</li>
        </ul>
        <p>You can review and approve/reject this request in your admin dashboard.</p>
      `,
    });

    if (error) {
      throw error;
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-creator-request-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
