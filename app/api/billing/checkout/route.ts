import { NextRequest, NextResponse } from 'next/server';

// Dodo Payments Checkout API
// Documentation: https://docs.dodopayments.com

const DODO_API_KEY = process.env.DODO_API_KEY;
const DODO_API_URL = 'https://api.dodopayments.com/v1';

const PRICE_IDS = {
  pro: process.env.DODO_PRO_PRICE_ID || 'price_pro_monthly',
  business: process.env.DODO_BUSINESS_PRICE_ID || 'price_business_monthly',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, email } = body;

    if (!plan || !['pro', 'business'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    if (!DODO_API_KEY) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    // TODO: Create checkout session with Dodo Payments
    // const response = await fetch(`${DODO_API_URL}/checkout/sessions`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${DODO_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     price_id: PRICE_IDS[plan],
    //     customer_email: email,
    //     success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    //     cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancelled`,
    //   }),
    // });
    // const session = await response.json();

    // Placeholder response
    return NextResponse.json({
      url: '/pricing?demo=true',
      sessionId: 'demo_session_' + Date.now(),
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
