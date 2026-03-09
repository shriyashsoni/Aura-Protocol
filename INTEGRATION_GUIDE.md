# Aura Protocol Integration Guide

## Complete Setup & Deployment Instructions

This guide walks you through integrating the frontend and backend, then deploying to Vercel.

## What's Been Done

Your Aura Protocol project has been fully integrated:

✅ **Backend → Frontend Migration**
- Express API routes converted to Next.js API routes
- All backend utilities merged into frontend `/src/lib`
- Marketplace, health, and commitment endpoints created

✅ **API Routes Created**
- `/api/v1/health` - Service health check
- `/api/v1/marketplace/listings` - Get/create marketplace listings
- All existing routes preserved and working

✅ **Centralized API Client**
- `/src/lib/api-client.ts` - Easy-to-use API wrapper
- Type-safe API calls with proper error handling
- Pre-configured for all endpoints

✅ **Production Configuration**
- Next.js optimized for performance
- Security headers configured
- Environment variables template provided
- Vercel deployment ready

## Next Steps: Deploy to Vercel

### Step 1: Prepare Your Repository

Make sure all changes are committed:

```bash
git add .
git commit -m "feat: integrate backend and frontend for vercel deployment"
git push origin connect-front-and-backend
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Select your GitHub repository (`shriyashsoni/Aura-Protocol`)
4. **Configure the project:**
   - Framework: **Next.js** (auto-detected)
   - Root Directory: **`frontend`** (very important!)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)

5. **Add Environment Variables** in the "Environment Variables" section:
   ```
   ALEO_NETWORK=testnet
   ALEO_RPC_URL=https://api.explorer.provable.com/v1
   PROGRAM_PROFILE_REGISTRY=profile_registry.aleo
   PROGRAM_DATA_MARKET=data_market.aleo
   PROGRAM_ACCESS_TICKETING=access_ticketing.aleo
   PROGRAM_INFERENCE_SETTLEMENT=inference_settlement.aleo
   PROGRAM_PAYMENT_ROUTER=payment_router.aleo
   ```

6. Click **"Deploy"**

7. Wait for deployment to complete (usually 1-3 minutes)

#### Option B: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to your Vercel account
vercel login

# Deploy
cd frontend
vercel

# For production deployment
vercel --prod
```

### Step 3: Verify Deployment

After deployment completes, you'll get a URL like: `https://aura-protocol.vercel.app`

Test it:

```bash
# Test health endpoint
curl https://aura-protocol.vercel.app/api/v1/health

# Test marketplace
curl https://aura-protocol.vercel.app/api/v1/marketplace/listings

# Test programs
curl https://aura-protocol.vercel.app/api/v1/programs
```

## Using the API Client in Your Components

The frontend already includes an integrated API client. Update your components:

```typescript
'use client';

import { api } from '@/lib/api-client';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch marketplace listings
    api.marketplace.getListings().then(response => {
      if (response.success) {
        setListings(response.data || []);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {listings.map(listing => (
        <div key={listing.id}>
          <h3>{listing.title}</h3>
          <p>{listing.description}</p>
          <span>{listing.price}</span>
        </div>
      ))}
    </div>
  );
}
```

See `/src/app/dashboard/market/page.tsx` for a real example.

## API Endpoints Reference

All endpoints are prefixed with `/api/v1` and return JSON:

### Marketplace
- `GET /marketplace/listings` - Get all listings (filters: `dataType`, `available`)
- `POST /marketplace/listings` - Create new listing

### Commitments
- `GET /commitments/profile` - Get profile commitments
- `GET /commitments/query` - Query commitments

### Programs
- `GET /programs` - Get all Aleo programs
- `GET /flow/architecture` - Get system architecture

### Payloads
- `POST /payloads/profile/register` - Register profile
- `POST /payloads/market/create-listing` - Create listing
- `POST /payloads/payment/create-intent` - Create payment
- `POST /payloads/ticket/issue` - Issue access ticket
- `POST /payloads/inference/settle` - Settle inference

### Health
- `GET /health` - Service health check

## Environment Variables

Create `/frontend/.env.local` for local development:

```env
# Aleo Network Configuration
ALEO_NETWORK=testnet
ALEO_RPC_URL=https://api.explorer.provable.com/v1

# Aleo Programs
PROGRAM_PROFILE_REGISTRY=profile_registry.aleo
PROGRAM_DATA_MARKET=data_market.aleo
PROGRAM_ACCESS_TICKETING=access_ticketing.aleo
PROGRAM_INFERENCE_SETTLEMENT=inference_settlement.aleo
PROGRAM_PAYMENT_ROUTER=payment_router.aleo

# Optional: Override API URL if running separately
# NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
```

## Troubleshooting

### Deployment fails with "Root directory not found"
- In Vercel dashboard, make sure Root Directory is set to `frontend`
- Don't use `./frontend`, just `frontend`

### API endpoints returning 404
- Verify all route files exist in `/frontend/src/app/api/v1/`
- Check Next.js app structure is correct
- Restart dev server with `npm run dev`

### Environment variables not working
- Add variables in Vercel dashboard Settings > Environment Variables
- After adding, redeploy with `Redeploy` button
- Variables are case-sensitive

### Can't connect to API locally
- Ensure `NEXT_PUBLIC_API_URL` is not set (defaults to `/api/v1`)
- Dev server running on `localhost:3000`
- Check browser console for actual API URL being called

### Build fails locally
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

## Project Structure After Integration

```
Aura-Protocol/
├── frontend/                          # Main Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/v1/               # API routes (replaces backend)
│   │   │   │   ├── health/
│   │   │   │   ├── marketplace/
│   │   │   │   ├── commitments/
│   │   │   │   ├── payloads/
│   │   │   │   ├── programs/
│   │   │   │   └── flow/
│   │   │   ├── dashboard/            # User pages
│   │   │   ├── components/           # React components
│   │   │   └── layout.tsx
│   │   ├── lib/
│   │   │   ├── api-client.ts         # API communication
│   │   │   ├── config.ts             # Configuration
│   │   │   └── commitments.ts        # Utilities
│   │   └── types/
│   ├── public/                        # Static files
│   ├── package.json
│   ├── next.config.ts                # Next.js config
│   └── tsconfig.json
├── backend/                           # Reference only (not deployed)
├── vercel.json                        # Vercel config
├── .env.example                       # Template
├── DEPLOYMENT.md                      # Detailed guide
└── README.md                          # Overview
```

## Monitoring Your Deployment

### In Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Check "Deployments" tab for deployment history
4. Click a deployment to see logs and analytics
5. Use "Function Logs" for real-time API logs

### View Recent Logs
```bash
vercel logs <deployment-url>
```

## Advanced Configuration

### Custom Domain
1. In Vercel dashboard, go to Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Preview Deployments
- Every GitHub PR automatically deploys a preview
- Share preview URL with team for review
- Automatic cleanup after PR merge

### GitHub Integration
- Automatic deployments on push to `main` branch
- Preview deployments for all PRs
- Rollback to any previous deployment

## Next: Add Database (Optional)

To persist data, add a database:

```bash
# Supabase (PostgreSQL)
npm install @supabase/supabase-js

# Or Neon (Serverless PostgreSQL)
npm install @neondatabase/serverless pg
```

Then update `/src/app/api/v1/marketplace/listings/route.ts` to use database instead of in-memory array.

## Next: Add Authentication (Optional)

Implement Aleo wallet authentication:

```typescript
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';

export default function MyComponent() {
  const wallet = useWallet();
  
  if (!wallet.connected) {
    return <button onClick={wallet.connect}>Connect Wallet</button>;
  }
  
  return <div>Connected: {wallet.publicKey}</div>;
}
```

## Success Checklist

- [x] Backend API routes created
- [x] API client configured
- [x] Environment variables template created
- [x] Vercel configuration ready
- [x] Dashboard updated with real API calls
- [ ] Deploy to Vercel ← **You are here**
- [ ] Test all endpoints on production
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Add database for persistence (optional)
- [ ] Implement wallet authentication (optional)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Reference**: See `API_ENDPOINTS.md`

---

**Ready to deploy?** Follow the "Deploy to Vercel" section above and you'll have a fully functional, production-ready Aura Protocol marketplace running in minutes!
