# PDFKit Pro - Environment Variables Guide

> Configuration for local development and Vercel deployment

---

## Quick Start

1. Copy `.env.example` to `.env.local`
2. Fill in the required variables
3. Run `npm run dev`

---

## Required Variables

These variables must be set for the application to function:

### Authentication (Auth.js)

```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-secret-key-here

# Application URL (no trailing slash)
NEXTAUTH_URL=http://localhost:3000
```

### Supabase

```env
# From Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## Optional Variables

These enable additional features:

### OAuth Providers

#### GitHub

```env
# Create at: https://github.com/settings/developers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

#### Google

```env
# Create at: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Dodo Payments

```env
# From Dodo Payments Dashboard
DODO_API_KEY=sk_live_your-api-key
DODO_API_URL=https://api.dodopayments.com/v1
DODO_WEBHOOK_SECRET=whsec_your-webhook-secret

# Price IDs for subscription plans
DODO_PRO_MONTHLY_PRICE_ID=price_pro_monthly
DODO_PRO_YEARLY_PRICE_ID=price_pro_yearly
DODO_BUSINESS_MONTHLY_PRICE_ID=price_business_monthly
DODO_BUSINESS_YEARLY_PRICE_ID=price_business_yearly
```

### Application Settings

```env
# Public URL for production
NEXT_PUBLIC_APP_URL=https://pdfkit.pro

# Feature flags
NEXT_PUBLIC_ENABLE_AI=false
NEXT_PUBLIC_ENABLE_CLOUD=false
```

---

## Vercel Deployment

### Step 1: Connect Repository

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select Next.js framework preset

### Step 2: Configure Environment Variables

In Vercel Dashboard > Project > Settings > Environment Variables:

| Variable | Environment | Required |
|----------|-------------|----------|
| `NEXTAUTH_SECRET` | All | Yes |
| `NEXTAUTH_URL` | Production | Auto-set |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | All | Yes |
| `GITHUB_CLIENT_ID` | All | Recommended |
| `GITHUB_CLIENT_SECRET` | All | Recommended |
| `DODO_API_KEY` | Production | For payments |
| `DODO_WEBHOOK_SECRET` | Production | For payments |

### Step 3: Configure OAuth Callbacks

Update your OAuth provider settings:

**GitHub:**
- Homepage URL: `https://your-domain.vercel.app`
- Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

**Google:**
- Authorized redirect URIs: `https://your-domain.vercel.app/api/auth/callback/google`

### Step 4: Configure Webhook Endpoint

In Dodo Payments Dashboard:
- Webhook URL: `https://your-domain.vercel.app/api/billing/webhook`
- Events: `checkout.completed`, `subscription.*`, `payment.*`

---

## Local Development

### Minimal Setup (No Auth)

```env
# .env.local
NEXTAUTH_SECRET=development-secret-not-for-production
NEXTAUTH_URL=http://localhost:3000
```

The app will run in demo mode without full authentication.

### Full Setup

Create `.env.local` with all variables:

```env
# Auth
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# OAuth
GITHUB_CLIENT_ID=your-id
GITHUB_CLIENT_SECRET=your-secret

# Payments (optional for dev)
DODO_API_KEY=sk_test_...
```

---

## Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use different secrets** for development and production
3. **Rotate secrets** regularly, especially after team changes
4. **Use environment-specific** OAuth apps (dev vs prod)

---

## Troubleshooting

### "Auth not configured"
- Check `NEXTAUTH_SECRET` is set
- Verify Supabase credentials

### OAuth redirect errors
- Ensure callback URLs match exactly
- Check for trailing slashes
- Verify environment (dev vs prod)

### Webhook failures
- Check `DODO_WEBHOOK_SECRET` matches dashboard
- Verify endpoint is publicly accessible
- Check Vercel function logs

### Build failures
- App builds without env vars (demo mode)
- Missing vars cause runtime errors, not build errors
