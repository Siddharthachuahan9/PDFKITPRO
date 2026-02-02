import { handlers } from '@/lib/auth';
import { NextResponse } from 'next/server';

// Fallback handlers when auth is not configured
const fallbackHandler = () => {
  return NextResponse.json(
    { error: 'Authentication not configured. Please set up environment variables.' },
    { status: 503 }
  );
};

export const GET = handlers?.GET ?? fallbackHandler;
export const POST = handlers?.POST ?? fallbackHandler;
