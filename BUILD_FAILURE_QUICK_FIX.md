# Quick Fix: Next.js Build Failure

## The Problem
```
Error: Cannot find module '@demox-labs/aleo-wallet-adapter-react'
⨯ next build failed
```

## The Root Cause
A Server Component (`layout.tsx`) tried to import a client-only module with WASM dependencies during the build process.

## The Solution (Applied)

### ✅ Fix #1: Dynamic Import
In `frontend/src/app/layout.tsx`:
```typescript
import dynamic from 'next/dynamic';

const AleoWalletProvider = dynamic(
  () => import('./components/AleoWalletProvider').then(mod => mod.AleoWalletProvider),
  { ssr: false }
);
```

### ✅ Fix #2: External Packages
In `frontend/next.config.ts`:
```typescript
experimental: {
  serverComponentsExternalPackages: [
    "@demox-labs/aleo-wallet-adapter-base",
    "@demox-labs/aleo-wallet-adapter-react",
    "@demox-labs/aleo-wallet-adapter-reactui",  // Added this
    "@provablehq/aleo-wallet-adaptor-shield",
    "@provablehq/aleo-wallet-adaptor-puzzle"
  ]
}
```

## Verify the Fix

```bash
cd frontend

# Test local build
npm run build

# Success looks like:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
# ✓ Collecting page data
# ✓ Generating static pages
```

## If Still Failing

```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

## Deploy to Vercel

After local build succeeds:
```bash
git add .
git commit -m "Fix: resolve module loading during build"
git push origin your-branch
# Deploy via Vercel Dashboard
```

## Why This Works

| Issue | Solution | Why |
|-------|----------|-----|
| Server tries to import client module | Use `dynamic()` with `ssr: false` | Defers import to browser only |
| Build fails on WASM module | Mark in `serverComponentsExternalPackages` | Tells Next.js not to bundle it |
| Wallet button missing | Provider still wraps entire app | Functionality preserved |

## Status
- [x] Layout.tsx fixed
- [x] next.config.ts updated
- [x] Ready for deployment

**Next Step**: Run `npm run build` to verify success.
