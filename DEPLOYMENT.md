# PDFKit Pro - Deployment Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (recommended)

## Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pdfkit-pro.git
   cd pdfkit-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Deploying to Vercel

### Option 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pdfkit-pro)

### Option 2: Manual Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production:
   ```bash
   vercel --prod
   ```

## Environment Variables

Set these in your Vercel project settings:

### Required for Basic Functionality
- `NEXT_PUBLIC_APP_URL` - Your production URL

### Required for Pro Features

#### Billing (Dodo Payments)
- `DODO_API_KEY` - Your Dodo Payments API key
- `DODO_WEBHOOK_SECRET` - Webhook signing secret
- `DODO_PRO_PRICE_ID` - Price ID for Pro plan
- `DODO_BUSINESS_PRICE_ID` - Price ID for Business plan

#### Cloud Storage (Cloudflare R2)
- `R2_ACCOUNT_ID` - Cloudflare account ID
- `R2_ACCESS_KEY_ID` - R2 access key
- `R2_SECRET_ACCESS_KEY` - R2 secret key
- `R2_BUCKET_NAME` - R2 bucket name

#### AI Features
- `OPENAI_API_KEY` - OpenAI API key (for Chat with PDF)
- `MISTRAL_API_KEY` - Alternative: Mistral API key

## Setting Up Dodo Payments

1. Create account at [Dodo Payments](https://dodopayments.com)

2. Create products:
   - Pro: $7/month
   - Business: $29/month

3. Get API keys from dashboard

4. Configure webhook:
   - URL: `https://yourdomain.com/api/billing/webhook`
   - Events: All subscription events

## Setting Up Cloudflare R2

1. Create R2 bucket in Cloudflare dashboard

2. Create API token with R2 permissions

3. Configure CORS policy:
   ```json
   {
     "AllowedOrigins": ["https://yourdomain.com"],
     "AllowedMethods": ["GET", "PUT"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }
   ```

## Performance Optimization

### Recommended Vercel Settings

- **Region**: Choose closest to your users
- **Functions**: Use Edge Runtime for API routes
- **Caching**: Enable ISR for tool pages

### CDN Configuration

PDFKit Pro works great with:
- Cloudflare (recommended with R2)
- Vercel Edge Network (automatic)

## Monitoring

Recommended monitoring tools:
- Vercel Analytics (built-in)
- Sentry (error tracking)
- Upstash (rate limiting + queues)

## Security Checklist

- [ ] All API keys in environment variables
- [ ] HTTPS enforced
- [ ] CSP headers configured
- [ ] Rate limiting enabled
- [ ] Webhook signatures verified

## Troubleshooting

### Build Fails

1. Check Node.js version (18+)
2. Clear `.next` folder
3. Delete `node_modules` and reinstall

### PDF.js Worker Issues

Ensure worker is loaded from CDN:
```javascript
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
```

### Large File Uploads

Increase limit in `next.config.mjs`:
```javascript
experimental: {
  serverActions: {
    bodySizeLimit: '10mb',
  },
}
```

## Support

- GitHub Issues: [Report bugs](https://github.com/yourusername/pdfkit-pro/issues)
- Email: support@pdfkit.pro
