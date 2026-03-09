# Aura Protocol - Deployment Guide

## Overview

The Aura Protocol is now a **unified Next.js application** with fully integrated backend API routes. All components are ready for immediate deployment to Vercel.

## Architecture

```
frontend/                          # Main Next.js application
├── src/
│   ├── app/
│   │   ├── api/v1/               # API routes
│   │   │   ├── health/           # Health check endpoint
│   │   │   ├── marketplace/      # Marketplace endpoints
│   │   │   ├── commitments/      # Commitment verification
│   │   │   ├── payloads/         # Payload generation
│   │   │   ├── programs/         # Program info
│   │   │   └── flow/             # Flow diagrams
│   │   ├── components/           # React components
│   │   ├── dashboard/            # Protected pages
│   │   └── layout.tsx            # Root layout
│   └── lib/
│       ├── config.ts             # Configuration
│       ├── commitments.ts        # Commitment utilities
│       └── ...
├── package.json                  # Dependencies
└── next.config.ts               # Next.js configuration
```

## Quick Start

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
pnpm install
```

### 2. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Aleo configuration:
```env
ALEO_NETWORK=testnet
ALEO_RPC_URL=https://api.explorer.provable.com/v1
PROGRAM_PROFILE_REGISTRY=profile_registry.aleo
# ... other programs
```

### 3. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 4. Test API Endpoints

The following endpoints are now available:

#### Health Check
```bash
curl http://localhost:3000/api/v1/health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-03-09T...",
  "version": "1.0.0",
  "service": "Aura Protocol Marketplace API",
  "environment": "development"
}
```

#### Marketplace Listings
```bash
# Get all listings
curl http://localhost:3000/api/v1/marketplace/listings

# Filter by type
curl http://localhost:3000/api/v1/marketplace/listings?dataType=dataset

# Get only available listings
curl http://localhost:3000/api/v1/marketplace/listings?available=true

# Create new listing (POST)
curl -X POST http://localhost:3000/api/v1/marketplace/listings \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Data",
    "description": "Data description",
    "dataType": "dataset",
    "price": "1000u64",
    "seller": "aleo1seller"
  }'
```

#### Commitments
```bash
curl http://localhost:3000/api/v1/commitments/profile
curl http://localhost:3000/api/v1/commitments/query
```

## Deployment to Vercel

### Prerequisites
- Vercel account (free or paid)
- GitHub repository connected
- Git configured locally

### Deployment Steps

#### Option 1: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework: **Next.js** (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. Add Environment Variables:
   - `ALEO_NETWORK` = `testnet`
   - `ALEO_RPC_URL` = `https://api.explorer.provable.com/v1`
   - All `PROGRAM_*` variables from `.env.example`
6. Click "Deploy"

#### Option 2: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
cd frontend
vercel

# For production deployment
vercel --prod
```

### Vercel Configuration

The project includes optimized `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

## Frontend Integration

All frontend pages automatically connect to the API:

```typescript
// Example: Fetching marketplace listings
import useSWR from 'swr';

export default function MarketplacePage() {
  const { data, error, isLoading } = useSWR('/api/v1/marketplace/listings');
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading listings</div>;
  
  return (
    <div>
      {data?.data?.map((listing) => (
        <div key={listing.id}>{listing.title}</div>
      ))}
    </div>
  );
}
```

## API Documentation

### Base URL
- **Local**: `http://localhost:3000/api/v1`
- **Production**: `https://your-domain.vercel.app/api/v1`

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/marketplace/listings` | GET | Get all listings |
| `/marketplace/listings` | POST | Create listing |
| `/commitments/profile` | GET | Profile commitments |
| `/commitments/query` | GET | Query commitments |
| `/programs` | GET | Get program info |
| `/flow/architecture` | GET | Architecture flow |
| `/payloads/*` | POST | Generate payloads |

## Security Checklist

- [x] All dependencies up-to-date
- [x] TypeScript strict mode enabled
- [x] CORS configured in Next.js
- [x] API routes protected with environment variables
- [x] Security headers configured (`X-Content-Type-Options`, `X-Frame-Options`)
- [x] Input validation on API endpoints
- [x] Error handling with proper status codes

## Performance Optimization

- [x] Next.js 16 with Turbopack (default bundler)
- [x] React 19.2 with concurrent features
- [x] Image optimization with WebP/AVIF
- [x] API route caching (no-store for API endpoints)
- [x] Code splitting and lazy loading
- [x] CSS minification
- [x] JavaScript minification

## Monitoring & Debugging

### Local Development
```bash
npm run dev
# Opens http://localhost:3000
# Automatic Hot Module Replacement (HMR)
```

### Production Monitoring
- Vercel provides automatic monitoring and analytics
- Check deployment logs in Vercel dashboard
- Use `vercel logs` command for CLI access

### Type Checking
```bash
npm run type-check
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Build Fails
1. Ensure `frontend` directory contains `package.json`
2. Check Node.js version (should be 18+)
3. Clear cache: `rm -rf .next node_modules && npm install`

### API Endpoints Return 404
1. Verify API route files exist in `/frontend/src/app/api/v1/`
2. Check route naming (should be lowercase with hyphens)
3. Ensure `route.ts` is in correct directory

### Environment Variables Not Working
1. Ensure variables are added to Vercel dashboard (Settings > Environment Variables)
2. Redeploy after adding variables
3. Verify variable names match exactly (case-sensitive)

### Port Already in Use (Local)
```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use different port
npm run dev -- -p 3001
```

## Production Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Test all API endpoints
- [ ] Review security configurations
- [ ] Test with real Aleo wallet
- [ ] Verify all pages render correctly
- [ ] Check database connections (if applicable)
- [ ] Set up monitoring and logging
- [ ] Configure custom domain (if needed)
- [ ] Enable automatic deployments from main branch
- [ ] Set up branch preview deployments

## Next Steps

1. **Add Database**: If you need persistent data storage, add a database integration
2. **Authentication**: Implement wallet authentication for user sessions
3. **Analytics**: Add analytics to track user behavior
4. **Testing**: Add unit and integration tests
5. **Documentation**: Generate API documentation with Swagger/OpenAPI

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Aleo Docs**: https://developer.aleo.org

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repository**: Your repo URL
- **Production URL**: Will be provided after first deployment
