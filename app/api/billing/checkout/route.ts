import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

// Dodo Payments Checkout API
// Documentation: https://docs.dodopayments.com

const DODO_API_KEY = process.env.DODO_API_KEY;
const DODO_API_URL = process.env.DODO_API_URL || 'https://api.dodopayments.com/v1';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Price IDs from Dodo Payments dashboard
const PRICE_IDS: Record<string, string | undefined> = {
  pro_monthly: process.env.DODO_PRO_MONTHLY_PRICE_ID,
  pro_yearly: process.env.DODO_PRO_YEARLY_PRICE_ID,
  business_monthly: process.env.DODO_BUSINESS_MONTHLY_PRICE_ID,
  business_yearly: process.env.DODO_BUSINESS_YEARLY_PRICE_ID,
};

interface CheckoutRequest {
  plan: 'pro' | 'business';
  interval?: 'monthly' | 'yearly';
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await auth();
    const body: CheckoutRequest = await request.json();
    const { plan, interval = 'monthly', email } = body;

    // Validation
    if (!plan || !['pro', 'business'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!['monthly', 'yearly'].includes(interval)) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    // Check if API is configured
    if (!DODO_API_KEY) {
      // Return demo mode response for development
      console.log('[Billing] Demo mode - Dodo API key not configured');
      return NextResponse.json({
        url: `${APP_URL}/dashboard?checkout=demo&plan=${plan}`,
        sessionId: `demo_${plan}_${Date.now()}`,
        demo: true,
      });
    }

    // Get price ID for selected plan and interval
    const priceKey = `${plan}_${interval}`;
    const priceId = PRICE_IDS[priceKey];

    if (!priceId) {
      console.error(`[Billing] Price ID not configured for: ${priceKey}`);
      return NextResponse.json(
        { error: 'Price not configured for this plan' },
        { status: 503 }
      );
    }

    // Customer email - use session email or provided email
    const customerEmail = session?.user?.email || email;

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Email is required for checkout' },
        { status: 400 }
      );
    }

    // Create Dodo Payments checkout session
    const response = await fetch(`${DODO_API_URL}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode: 'subscription',
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        success_url: `${APP_URL}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${APP_URL}/dashboard?checkout=cancelled`,
        metadata: {
          user_id: session?.user?.id || 'guest',
          plan,
          interval,
        },
        // Optional: prefill customer data
        ...(session?.user?.name && {
          customer_name: session.user.name,
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[Billing] Dodo API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 502 }
      );
    }

    const sessionData = await response.json();

    return NextResponse.json({
      url: sessionData.url,
      sessionId: sessionData.id,
    });
  } catch (error) {
    console.error('[Billing] Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve checkout session status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Demo mode
    if (sessionId.startsWith('demo_')) {
      return NextResponse.json({
        status: 'complete',
        plan: sessionId.split('_')[1],
        demo: true,
      });
    }

    if (!DODO_API_KEY) {
      return NextResponse.json(
        { error: 'Billing not configured' },
        { status: 503 }
      );
    }

    // Fetch session from Dodo
    const response = await fetch(`${DODO_API_URL}/checkout/sessions/${sessionId}`, {
      headers: {
        'Authorization': `Bearer ${DODO_API_KEY}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const session = await response.json();

    return NextResponse.json({
      status: session.status,
      plan: session.metadata?.plan,
      customerEmail: session.customer_email,
    });
  } catch (error) {
    console.error('[Billing] Get session error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve session' },
      { status: 500 }
    );
  }
}
