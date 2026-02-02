import { NextRequest, NextResponse } from 'next/server';

// Dodo Payments Webhook Handler
// This endpoint receives payment events from Dodo Payments

const DODO_WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('dodo-signature');

    if (!DODO_WEBHOOK_SECRET) {
      console.error('Webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured' },
        { status: 503 }
      );
    }

    // TODO: Verify webhook signature
    // const isValid = verifyDodoSignature(body, signature, DODO_WEBHOOK_SECRET);
    // if (!isValid) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.type) {
      case 'checkout.completed':
        // User completed checkout
        // TODO: Update user plan in database
        console.log('Checkout completed:', event.data);
        break;

      case 'subscription.created':
        // New subscription created
        // TODO: Activate pro features for user
        console.log('Subscription created:', event.data);
        break;

      case 'subscription.updated':
        // Subscription changed (upgrade/downgrade)
        // TODO: Update user plan in database
        console.log('Subscription updated:', event.data);
        break;

      case 'subscription.cancelled':
        // User cancelled subscription
        // TODO: Downgrade user to free plan
        console.log('Subscription cancelled:', event.data);
        break;

      case 'payment.failed':
        // Payment failed
        // TODO: Notify user, maybe downgrade after grace period
        console.log('Payment failed:', event.data);
        break;

      default:
        console.log('Unhandled event type:', event.type);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
