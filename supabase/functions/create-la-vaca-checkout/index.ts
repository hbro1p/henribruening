import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating La Vaca checkout session");
    
    // Get origin from request
    const { origin } = await req.json();
    if (!origin) {
      throw new Error("Origin is required");
    }

    // Initialize Stripe with secret key
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    console.log("Creating checkout session with price: price_1SXrLI0buUUHoU6QXAmQyD6E");

    // Create checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: "price_1SXrLI0buUUHoU6QXAmQyD6E", // La Vaca price ID
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/shop?success=true`,
      cancel_url: `${origin}/shop`,
      // Allow guest checkout - Stripe will collect email
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
