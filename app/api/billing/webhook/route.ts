import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';

// Dodo Payments Webhook Handler
// This endpoint receives payment events from Dodo Payments

const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;

// Verify Dodo Payments webhook signature
function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  try {
    // Dodo uses HMAC-SHA256 for webhook signatures
    // Format: t=timestamp,v1=signature
    const parts = signature.split(',');
    const timestamp = parts.find(p => p.startsWith('t='))?.slice(2);
    const sig = parts.find(p => p.startsWith('v1='))?.slice(3);

    if (!timestamp || !sig) return false;

    // Check timestamp is within 5 minutes (prevent replay attacks)
    const now = Math.floor(Date.now() / 1000);
    const webhookTime = parseInt(timestamp, 10);
    if (Math.abs(now - webhookTime) > 300) {
      console.error('[Webhook] Timestamp too old:', now - webhookTime, 'seconds');
      return false;
    }

    // Compute expected signature
    const signedPayload = `${timestamp}.${payload}`;
    const expectedSig = createHmac('sha256', secret)
      .update(signedPayload)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    return sig.length === expectedSig.length &&
      createHmac('sha256', secret).update(sig).digest('hex') ===
      createHmac('sha256', secret).update(expectedSig).digest('hex');
  } catch (error) {
    console.error('[Webhook] Signature verification error:', error);
    return false;
  }
}

// Update user's plan in the database
async function updateUserPlan(userId: string, plan: string, subscriptionId: string): Promise<boolean> {
  try {
    // In production, update Supabase database
    // For now, log the update
    console.log(`[Webhook] Updating user ${userId} to plan ${plan}, subscription: ${subscriptionId}`);

    // TODO: Uncomment when Supabase is configured
    // const { createClient } = await import('@supabase/supabase-js');
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
    //
    // const { error } = await supabase
    //   .from('users')
    //   .update({ plan, dodo_subscription_id: subscriptionId })
    //   .eq('id', userId);
    //
    // if (error) throw error;

    return true;
  } catch (error) {
    console.error('[Webhook] Failed to update user plan:', error);
    return false;
  }
}

// Handle subscription cancellation
async function handleCancellation(userId: string, subscriptionId: string): Promise<boolean> {
  try {
    console.log(`[Webhook] Cancelling subscription for user ${userId}: ${subscriptionId}`);

    // TODO: Uncomment when Supabase is configured
    // const { createClient } = await import('@supabase/supabase-js');
    // const supabase = createClient(
    //   process.env.NEXT_PUBLIC_SUPABASE_URL!,
    //   process.env.SUPABASE_SERVICE_ROLE_KEY!
    // );
    //
    // // Update user to free plan
    // const { error: userError } = await supabase
    //   .from('users')
    //   .update({ plan: 'free', dodo_subscription_id: null })
    //   .eq('id', userId);
    //
    // // Update subscription record
    // const { error: subError } = await supabase
    //   .from('subscriptions')
    //   .update({ status: 'cancelled' })
    //   .eq('dodo_subscription_id', subscriptionId);
    //
    // if (userError || subError) throw userError || subError;

    return true;
  } catch (error) {
    console.error('[Webhook] Failed to handle cancellation:', error);
    return false;
  }
}

interface DodoWebhookEvent {
  type: string;
  data: {
    id: string;
    customer_email?: string;
    metadata?: {
      user_id?: string;
      plan?: string;
    };
    subscription?: {
      id: string;
      status: string;
      plan?: string;
    };
    [key: string]: unknown;
  };
  created: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('dodo-signature');

    // Verify webhook is configured
    if (!DODO_WEBHOOK_SECRET) {
      console.warn('[Webhook] Secret not configured - accepting without verification (dev mode)');
      // In development, we can proceed without verification
      // In production, this should return an error
    } else {
      // Verify signature in production
      if (!verifySignature(body, signature, DODO_WEBHOOK_SECRET)) {
        console.error('[Webhook] Invalid signature');
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 401 }
        );
      }
    }

    const event: DodoWebhookEvent = JSON.parse(body);
    console.log(`[Webhook] Received event: ${event.type}`);

    // Extract common data
    const userId = event.data.metadata?.user_id;
    const plan = event.data.metadata?.plan;
    const subscriptionId = event.data.subscription?.id || event.data.id;

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.completed': {
        // User completed checkout successfully
        console.log('[Webhook] Checkout completed:', {
          userId,
          plan,
          email: event.data.customer_email,
        });

        if (userId && plan) {
          await updateUserPlan(userId, plan, subscriptionId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'subscription.created': {
        // New subscription created
        console.log('[Webhook] Subscription created:', {
          subscriptionId,
          userId,
          plan,
        });

        if (userId && plan) {
          await updateUserPlan(userId, plan, subscriptionId);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'subscription.updated': {
        // Subscription changed (upgrade/downgrade/renewal)
        const newPlan = event.data.subscription?.plan || plan;
        console.log('[Webhook] Subscription updated:', {
          subscriptionId,
          userId,
          newPlan,
        });

        if (userId && newPlan) {
          await updateUserPlan(userId, newPlan, subscriptionId);
        }
        break;
      }

      case 'customer.subscription.deleted':
      case 'subscription.cancelled':
      case 'subscription.canceled': {
        // User cancelled subscription
        console.log('[Webhook] Subscription cancelled:', {
          subscriptionId,
          userId,
        });

        if (userId) {
          await handleCancellation(userId, subscriptionId);
        }
        break;
      }

      case 'invoice.payment_failed':
      case 'payment.failed': {
        // Payment failed - notify user
        console.log('[Webhook] Payment failed:', {
          userId,
          subscriptionId,
        });
        // TODO: Send email notification to user
        // TODO: Consider grace period before downgrading
        break;
      }

      case 'invoice.paid':
      case 'payment.succeeded': {
        // Successful payment (renewal)
        console.log('[Webhook] Payment succeeded:', {
          userId,
          subscriptionId,
        });
        break;
      }

      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Processing error:', error);
    // Return 200 anyway to prevent Dodo from retrying
    // Log the error for investigation
    return NextResponse.json({ received: true, error: 'Processing failed' });
  }
}

// Respond to webhook verification requests (if Dodo uses this pattern)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get('challenge');

  if (challenge) {
    // Echo back the challenge for webhook verification
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  return NextResponse.json({ status: 'Webhook endpoint active' });
}
