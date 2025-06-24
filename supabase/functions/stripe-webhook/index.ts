const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, stripe-signature",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    // Get the Stripe webhook secret from environment variables
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET environment variable not set");
      return new Response("Internal server error", {
        status: 500,
        headers: corsHeaders,
      });
    }

    // Get the Stripe signature from headers
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      console.error("Missing stripe-signature header");
      return new Response("Missing signature", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Get the raw body
    const body = await req.text();
    
    // Verify the webhook signature
    const isValidSignature = await verifyStripeSignature(body, signature, webhookSecret);
    if (!isValidSignature) {
      console.error("Invalid Stripe signature");
      return new Response("Invalid signature", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Parse the event
    const event = JSON.parse(body);
    console.log("Received Stripe event:", event.type);

    // Handle checkout.session.completed events
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      
      // Extract relevant data
      const checkoutSessionId = session.id;
      const clientReferenceId = session.client_reference_id; // This should contain the consultaId
      const customerEmail = session.customer_details?.email || session.customer_email;
      const customerId = session.customer;
      const paymentIntentId = session.payment_intent;
      const amountTotal = session.amount_total;
      const currency = session.currency;
      const paymentStatus = session.payment_status;

      console.log("Processing checkout.session.completed:", {
        checkoutSessionId,
        clientReferenceId,
        customerEmail,
        customerId,
        paymentIntentId,
        amountTotal,
        currency,
        paymentStatus
      });

      // Prepare data to send to n8n
      const n8nPayload = {
        event_type: "checkout.session.completed",
        checkout_session_id: checkoutSessionId,
        client_reference_id: clientReferenceId,
        customer_email: customerEmail,
        customer_id: customerId,
        payment_intent_id: paymentIntentId,
        amount_total: amountTotal,
        currency: currency,
        payment_status: paymentStatus,
        metadata: session.metadata || {},
        timestamp: new Date().toISOString()
      };

      // Send to n8n webhook
      try {
        const n8nResponse = await fetch("https://drprocesso.app.n8n.cloud/webhook/stripe-cavar-fundo-sucesso", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(n8nPayload),
        });

        if (!n8nResponse.ok) {
          console.error("Failed to send data to n8n:", n8nResponse.status, n8nResponse.statusText);
          // Still return 200 to Stripe to avoid retries
        } else {
          console.log("Successfully sent data to n8n");
        }
      } catch (error) {
        console.error("Error sending data to n8n:", error);
        // Still return 200 to Stripe to avoid retries
      }
    } else {
      console.log("Unhandled event type:", event.type);
    }

    // Always return 200 to Stripe to acknowledge receipt
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });

  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal server error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});

// Function to verify Stripe webhook signature
async function verifyStripeSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Parse the signature header
    const elements = signature.split(",");
    const signatureElements: { [key: string]: string } = {};
    
    for (const element of elements) {
      const [key, value] = element.split("=");
      signatureElements[key] = value;
    }

    const timestamp = signatureElements.t;
    const v1Signature = signatureElements.v1;

    if (!timestamp || !v1Signature) {
      return false;
    }

    // Create the signed payload
    const signedPayload = `${timestamp}.${payload}`;

    // Create HMAC
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature_bytes = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(signedPayload)
    );

    // Convert to hex
    const expectedSignature = Array.from(new Uint8Array(signature_bytes))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    // Compare signatures
    return expectedSignature === v1Signature;
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false;
  }
}