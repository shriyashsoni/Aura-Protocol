# Quick Start Guide - Aura Protocol

## Local Development

### Prerequisites
- Node.js 18+ 
- npm 9+ or your preferred package manager

### Setup

1. **Clone and Install Dependencies**
   ```bash
   git clone https://github.com/shriyashsoni/Aura-Protocol.git
   cd Aura-Protocol
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

3. **Environment Variables**
   Copy `.env.example` to `.env.local` and add your configuration:
   ```bash
   cp .env.example .env.local
   ```

## Project Structure

```
Aura-Protocol/
├── frontend/                 # Next.js 16 app (main entry point)
│   ├── src/
│   │   ├── app/             # App Router pages and layouts
│   │   ├── components/      # React components
│   │   ├── lib/
│   │   │   ├── api-client.ts    # Unified API client
│   │   │   └── config.ts        # Configuration
│   │   └── types/           # TypeScript types
│   └── public/              # Static assets
├── backend/                 # Legacy (for reference)
│   └── api/                 # Express backend (migrated to Next.js API routes)
├── vercel.json             # Vercel deployment config
├── DEPLOYMENT.md           # Deployment guide
└── INTEGRATION_GUIDE.md    # API integration guide
```

## Available Scripts

```bash
npm run dev         # Start development server (port 3000)
npm run build       # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
npm run type-check # Check TypeScript types
```

## API Endpoints

All API endpoints are available at `/api/v1/*`:

### Marketplace
- `GET /api/v1/marketplace/listings` - Get all listings
- `POST /api/v1/marketplace/listings` - Create new listing
- `GET /api/v1/marketplace/listings/:id` - Get listing details
- `PUT /api/v1/marketplace/listings/:id` - Update listing
- `DELETE /api/v1/marketplace/listings/:id` - Delete listing

### Health Check
- `GET /api/v1/health` - Server health status

## Making API Calls

Use the unified API client in `/src/lib/api-client.ts`:

```typescript
import { api } from '@/lib/api-client';

// Get marketplace listings
const response = await api.marketplace.getListings({ 
  available: true 
});

if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy - it's automatic on each push!

See `DEPLOYMENT.md` for detailed instructions.

## Troubleshooting

**Dev server won't start?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Port 3000 already in use?**
```bash
npm run dev -- -p 3001
```

**Type errors?**
```bash
npm run type-check
```

## Documentation

- `DEPLOYMENT.md` - Production deployment guide
- `INTEGRATION_GUIDE.md` - Complete API integration reference
- `README.md` - Project overview

## Need Help?

- Check GitHub Issues
- Review the integration guides
- See the existing examples in `/dashboard/market/page.tsx`

## Next Steps

1. Update environment variables in `.env.local`
2. Explore the dashboard at `/dashboard`
3. Review API client usage in existing components
4. Create your first data listing in the marketplace!
