import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { booking_id, email_type = "booking_confirmation", update_type = null, new_details = null } = await req.json();

    if (!booking_id) {
      return new Response(JSON.stringify({ error: "booking_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const resendApiKey = Deno.env.get("RESEND_API_KEY") ?? "";
    const emailFrom = Deno.env.get("EMAIL_FROM") || "CAVEMEN Grooming Lounge <onboarding@resend.dev>";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch booking details
    const { data: booking, error: bookingErr } = await supabase
      .from("bookings")
      .select(`
        *,
        service:services(name, duration_minutes, price),
        staff:staff(full_name)
      `)
      .eq("id", booking_id)
      .single();

    if (bookingErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Fetch business settings
    const { data: settings } = await supabase
      .from("business_settings")
      .select("*")
      .limit(1)
      .single();

    const businessName = settings?.business_name || "CAVEMEN";
    const businessAddress = settings?.address || "Westlands Square, 3rd Floor, Nairobi, Kenya";
    const businessPhone = settings?.phone || "+254 700 000 000";
    const currency = settings?.currency || "KES";
    const cancellationPolicy = settings?.cancellation_policy || "Appointments may be rescheduled or cancelled up to 2 hours prior to scheduled start.";

    // 3. Construct Subject & HTML Email
    let subject = "Welcome to CAVEMEN — Your Appointment Is Booked";
    if (email_type === "status_update") {
      subject = `CAVEMEN Appointment Update — ${booking.booking_reference} (${booking.status.toUpperCase()})`;
    } else if (email_type === "reminder") {
      subject = `Upcoming Appointment Reminder — CAVEMEN [${booking.booking_reference}]`;
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090909; color: #F2F0EA; margin: 0; padding: 20px 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #151515; border: 1px solid #262626; border-radius: 4px; overflow: hidden; }
        .header { background-color: #090909; padding: 36px 30px; text-align: center; border-bottom: 1px solid #A78355; }
        .brand-monogram { display: inline-block; width: 36px; height: 36px; line-height: 36px; border: 1px solid #A78355; color: #A78355; font-size: 16px; font-weight: bold; margin-bottom: 8px; }
        .brand-title { font-size: 26px; font-weight: 700; letter-spacing: 0.25em; color: #F2F0EA; margin: 0; text-transform: uppercase; }
        .brand-sub { font-size: 10px; letter-spacing: 0.25em; color: #A78355; text-transform: uppercase; margin-top: 4px; }
        .body { padding: 36px 30px; }
        .greeting { font-size: 18px; font-weight: 500; color: #F2F0EA; margin-bottom: 16px; }
        .intro-text { font-size: 14px; line-height: 1.6; color: #9E9D99; margin-bottom: 24px; }
        .card { background-color: #090909; border: 1px solid #A78355; border-radius: 2px; padding: 24px; margin-bottom: 24px; }
        .card-row { display: flex; justify-content: space-between; border-bottom: 1px solid #222222; padding: 10px 0; font-size: 13px; }
        .card-row:last-child { border-bottom: none; }
        .card-label { color: #9E9D99; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; }
        .card-value { color: #F2F0EA; font-weight: 600; text-align: right; }
        .highlight { color: #A78355; }
        .policy-box { background-color: #111111; border-left: 2px solid #A78355; padding: 14px 18px; font-size: 12px; color: #9E9D99; line-height: 1.5; margin-bottom: 28px; }
        .footer { background-color: #090909; padding: 24px 30px; text-align: center; border-top: 1px solid #222222; font-size: 11px; color: #777777; line-height: 1.6; }
        .footer a { color: #A78355; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand-monogram">C</div>
          <h1 class="brand-title">${businessName}</h1>
          <div class="brand-sub">Modern Grooming Lounge</div>
        </div>
        <div class="body">
          <div class="greeting">Greetings ${booking.customer_name},</div>
          <p class="intro-text">
            ${email_type === 'booking_confirmation' 
              ? "Welcome to CAVEMEN. Your appointment has been secured in our schedule. We look forward to providing you with an unhurried, precision grooming experience."
              : `Your booking status has been updated to <strong>${booking.status.toUpperCase()}</strong>.`
            }
          </p>

          <div class="card">
            <div class="card-row">
              <span class="card-label">Booking Reference</span>
              <span class="card-value highlight">${booking.booking_reference}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Service</span>
              <span class="card-value">${booking.service?.name || 'Grooming Service'}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Master Barber</span>
              <span class="card-value">${booking.staff?.full_name || 'Assigned Master Barber'}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Appointment Date</span>
              <span class="card-value">${booking.appointment_date}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Appointment Time</span>
              <span class="card-value">${booking.start_time} - ${booking.end_time}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Investment</span>
              <span class="card-value">${currency} ${Number(booking.total_price).toLocaleString()}</span>
            </div>
            <div class="card-row">
              <span class="card-label">Status</span>
              <span class="card-value highlight">${booking.status.toUpperCase()}</span>
            </div>
          </div>

          <div class="policy-box">
            <strong>Studio Location:</strong> ${businessAddress}<br>
            <strong>Concierge Contact:</strong> ${businessPhone}<br>
            <strong>Cancellation Policy:</strong> ${cancellationPolicy}
          </div>

          <p class="intro-text" style="font-size: 12px; margin-bottom: 0;">
            * Complimentary refreshments (espresso, water, and select beverages) are provided in our private lounge prior to your service.
          </p>
        </div>
        <div class="footer">
          &copy; ${new Date().getFullYear()} ${businessName}. All rights reserved.<br>
          "More Than a Haircut. It's an Experience."
        </div>
      </div>
    </body>
    </html>
    `;

    // 4. Send via Resend API
    let providerMessageId = null;
    let deliveryStatus = "pending";
    let errorMessage = null;

    try {
      const resendRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: emailFrom,
          to: [booking.customer_email],
          subject: subject,
          html: html,
        }),
      });

      const resendData = await resendRes.json();

      if (resendRes.ok && resendData?.id) {
        providerMessageId = resendData.id;
        deliveryStatus = "sent";
      } else {
        deliveryStatus = "failed";
        errorMessage = resendData?.message || JSON.stringify(resendData);
        console.error("Resend API rejected email:", resendData);
      }
    } catch (sendErr) {
      deliveryStatus = "failed";
      errorMessage = (sendErr as Error).message;
      console.error("Network error sending to Resend:", sendErr);
    }

    // 5. Always record attempt in email_logs
    await supabase.from("email_logs").insert({
      booking_id: booking.id,
      recipient_email: booking.customer_email,
      email_type: email_type,
      provider_message_id: providerMessageId,
      delivery_status: deliveryStatus,
      error_message: errorMessage,
    });

    return new Response(JSON.stringify({
      success: deliveryStatus === "sent",
      delivery_status: deliveryStatus,
      provider_message_id: providerMessageId,
      error: errorMessage,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
