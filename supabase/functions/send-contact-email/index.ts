
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData: ContactFormData = await req.json();
    console.log("Received contact form data:", formData);

    // Send notification email to admin/business owner
    const adminEmailResponse = await resend.emails.send({
      from: "Al Nawakhdha <onboarding@resend.dev>",
      to: ["nawakhdha2058@gmail.com"], // Replace with your business email
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Submitted via Al Nawakhdha website contact form</em></p>
      `,
    });

    console.log("Admin email sent:", adminEmailResponse);

    // Send confirmation email to the customer
    const customerEmailResponse = await resend.emails.send({
      from: "Al Nawakhdha <onboarding@resend.dev>",
      to: [formData.email],
      subject: "Thank you for contacting Al Nawakhdha",
      html: `
        <h2>Thank you for your message, ${formData.name}!</h2>
        <p>We have received your inquiry about "<strong>${formData.subject}</strong>" and will get back to you as soon as possible.</p>
        
        <h3>Your Message Summary:</h3>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong> ${formData.message.replace(/\n/g, '<br>')}</p>
        
        <p>Our team typically responds within 24-48 hours during business days.</p>
        
        <p>Best regards,<br>
        Al Nawakhdha Furniture Team<br>
        Phone: +973 3313 3750<br>
        Email: nawakhdha2058@gmail.com</p>
      `,
    });

    console.log("Customer email sent:", customerEmailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        adminEmail: adminEmailResponse, 
        customerEmail: customerEmailResponse 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
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
