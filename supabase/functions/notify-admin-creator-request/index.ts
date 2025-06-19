
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// Get environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const adminEmailsEnv = Deno.env.get("ADMIN_EMAILS") || "events@the-lineup.com";

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

  console.log("Processing creator request notification...");

  // Validate environment variables
  if (!resendApiKey) {
    console.error("RESEND_API_KEY environment variable is not set.");
    return new Response(JSON.stringify({ 
      error: "Server configuration error: Missing Resend API key.",
      success: false 
    }), {
      status: 200, // Return 200 to avoid blocking the main flow
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  try {
    // Dynamically import Resend
    const { Resend } = await import("npm:resend@2.0.0");
    const resend = new Resend(resendApiKey);
    
    const adminEmailList = adminEmailsEnv.split(',').map(email => email.trim()).filter(Boolean);

    if (adminEmailList.length === 0) {
      console.error("No valid admin email addresses found.");
      return new Response(JSON.stringify({ 
        error: "Server configuration error: No valid admin email addresses found.",
        success: false 
      }), {
        status: 200, // Return 200 to avoid blocking the main flow
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const payload: CreatorRequestPayload = await req.json();
    const { username, user_email, reason, contact_email, contact_phone } = payload;
    
    console.log(`Processing creator request from user: ${username} (${user_email})`);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          New Creator Access Request
        </h1>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #007bff; margin-top: 0;">User Details</h2>
          <p><strong>Username:</strong> ${username}</p>
          <p><strong>Email:</strong> ${user_email}</p>
        </div>

        <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #007bff; margin-top: 0;">Request Details</h2>
          <p><strong>Reason for requesting access:</strong></p>
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
            ${reason}
          </div>
          
          <h3 style="color: #495057;">Additional Contact Information</h3>
          <p><strong>Contact Email:</strong> ${contact_email || 'Not provided'}</p>
          <p><strong>Contact Phone:</strong> ${contact_phone || 'Not provided'}</p>
        </div>

        <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #004085;">
            <strong>Action Required:</strong> Please review this request in your admin dashboard and approve or deny accordingly.
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
        
        <p style="color: #6c757d; font-size: 14px; text-align: center;">
          This is an automated notification from The Line-Up event management system.
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "The Line-Up Admin <onboarding@resend.dev>", 
      to: adminEmailList,
      subject: `🎫 New Event Creator Request from ${username}`,
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", JSON.stringify(error, null, 2));
      return new Response(JSON.stringify({ 
        error: `Failed to send notification email: ${error.message}`,
        success: false 
      }), {
        status: 200, // Return 200 to avoid blocking the main flow
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log(`Admin notification email sent successfully to: ${adminEmailList.join(', ')}`);
    console.log("Email data:", data);

    return new Response(JSON.stringify({ 
      message: "Notification sent successfully.",
      emailId: data?.id,
      success: true 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-admin-creator-request function:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Failed to send notification",
      success: false 
    }), {
      status: 200, // Return 200 to avoid blocking the main flow
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
