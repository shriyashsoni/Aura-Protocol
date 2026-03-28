# Deployment Troubleshooting Guide: Next.js Build Failure

## Executive Summary

**Issue**: The `next build` command fails with `MODULE_NOT_FOUND` error when deploying to production.

**Root Cause**: Server-side code attempts to import client-only WASM modules (`@demox-labs/aleo-wallet-adapter-react`) during the build process, causing module resolution to fail.

**Solution**: Use dynamic imports with `ssr: false` to defer client-only module loading until runtime on the client.

---

## Problem Analysis

### Error Signature
```
Error: Cannot find module '@demox-labs/aleo-wallet-adapter-react'
  at @demox-labs/aleo-wallet-adapter-react (.next/server/app/_not-found/page.js:110:18)
  at eval (webpack-internal:///(ssr)/./src/app/components/AleoWalletProvider.tsx:9:95)
```

### Why This Happens

1. **Direct Server Import**: `layout.tsx` (a Server Component) directly imported `AleoWalletProvider`
2. **Client Module in Server**: `AleoWalletProvider` imports `@demox-labs/aleo-wallet-adapter-react` - a browser-only module with WASM dependencies
3. **Build-Time Resolution**: During `next build`, Next.js traverses the component tree and attempts to resolve ALL imports, including client-only modules
4. **Module Not Found**: Since the wallet adapter is a client-only library, it can't be resolved on the server

### Similar Scenarios
- Any WASM module imported in server components
- Browser APIs (window, document, localStorage) used at import time
- CSS-in-JS libraries that run at build time
- Third-party libraries without proper SSR support

---

## Diagnostic Process

### Level 1: Quick Checks
```bash
# 1. Verify dependencies are installed
npm list @demox-labs/aleo-wallet-adapter-react

# 2. Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# 3. Check for build errors
npm run build 2>&1 | head -50
```

### Level 2: Examine Import Statements
```bash
# Search for all imports of problematic packages
grep -r "@demox-labs/aleo-wallet-adapter-react" src/
grep -r "@demox-labs/aleo-wallet-adapter-reactui" src/
```

**Expected Output:**
```
src/app/layout.tsx:4:import { AleoWalletProvider } from './components/AleoWalletProvider';
src/app/components/AleoWalletProvider.tsx:3:import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
src/app/page.tsx:10:import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
src/app/page.tsx:11:import { WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
```

**Issue**: `layout.tsx` is a Server Component importing a client-only component

### Level 3: Verify Component Types
```bash
# Check which components have 'use client'
grep -B2 "use client" src/app/*.tsx src/app/components/*.tsx

# Identify Server vs Client components
grep -n "export default\|use client\|use server" src/app/layout.tsx
```

### Level 4: Check next.config.ts
```bash
# Verify external packages configuration
grep -A10 "serverComponentsExternalPackages" frontend/next.config.ts
```

---

## Solutions (In Order of Preference)

### Solution 1: Dynamic Import with SSR: false (RECOMMENDED)
Use `next/dynamic` in the Server Component to defer loading until client-side.

**File**: `src/app/layout.tsx`
```typescript
import dynamic from 'next/dynamic';

// Load this ONLY on the client
const AleoWalletProvider = dynamic(
  () => import('./components/AleoWalletProvider').then(mod => mod.AleoWalletProvider),
  { ssr: false }
);

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AleoWalletProvider>
          {children}
        </AleoWalletProvider>
      </body>
    </html>
  );
}
```

**Why This Works**:
- ✅ Defers import resolution until browser loads
- ✅ Next.js skips attempting to resolve client modules during build
- ✅ Provider initializes after hydration
- ✅ Maintains full wallet functionality

### Solution 2: Move Provider to Client Component
Wrap the provider in a dedicated client component.

**File**: `src/app/providers.tsx`
```typescript
'use client';

import { AleoWalletProvider } from './components/AleoWalletProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <AleoWalletProvider>{children}</AleoWalletProvider>;
}
```

**File**: `src/app/layout.tsx`
```typescript
import { Providers } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Solution 3: Externalize Packages (Already Applied)
Ensure wallet packages are marked as external in next.config.ts.

```typescript
experimental: {
  serverComponentsExternalPackages: [
    "@demox-labs/aleo-wallet-adapter-base",
    "@demox-labs/aleo-wallet-adapter-react",
    "@demox-labs/aleo-wallet-adapter-reactui",
    "@provablehq/aleo-wallet-adaptor-shield",
    "@provablehq/aleo-wallet-adaptor-puzzle"
  ]
}
```

**Note**: This alone won't fix the issue if the import path is still traversed by Next.js during build.

---

## Applied Fixes

### Fix 1: Dynamic Import in layout.tsx ✅
Changed direct import to dynamic import with `ssr: false`:
```diff
- import { AleoWalletProvider } from './components/AleoWalletProvider';
+ const AleoWalletProvider = dynamic(
+   () => import('./components/AleoWalletProvider').then(mod => mod.AleoWalletProvider),
+   { ssr: false }
+ );
```

### Fix 2: Updated next.config.ts ✅
Added `@demox-labs/aleo-wallet-adapter-reactui` to external packages list to handle all wallet-related imports.

---

## Verification Steps

### Step 1: Local Build Verification
```bash
cd frontend
npm run build
```

**Success Indicator**:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (0/4)
✓ Finalizing page optimization
```

**Failure Indicator** (Do NOT Proceed):
```
⨯ Build failed
Error: Cannot find module...
```

### Step 2: Start Local Server
```bash
npm run dev
```

Visit `http://localhost:3000` and verify:
- [ ] Page loads without white screen
- [ ] Wallet selector appears in header
- [ ] No console errors
- [ ] Wallet connect/disconnect works

### Step 3: Production Build Simulation
```bash
npm run build
npm run start
```

Test at `http://localhost:3000`:
- [ ] Full page renders
- [ ] All interactive elements function
- [ ] No 500 errors in logs

### Step 4: Deployment Validation

After deploying to Vercel:
```bash
# Check deployment logs
vercel logs

# Test in browser
# - Open DevTools (F12)
# - Check Console tab for errors
# - Test wallet connection
# - Verify all page sections render
```

### Step 5: Common Verification Checks

```bash
# 1. Verify no "use client" in layout.tsx
grep "use client" src/app/layout.tsx  # Should return nothing

# 2. Confirm dynamic import is present
grep "dynamic(" src/app/layout.tsx

# 3. Check that page.tsx still has "use client"
grep "use client" src/app/page.tsx  # Should find it

# 4. Verify external packages are listed
grep -A6 "serverComponentsExternalPackages" next.config.ts
```

---

## Environment-Specific Testing

### Testing Local Development
```bash
npm run dev          # Should load instantly
# Visit http://localhost:3000
# HMR should update changes
```

### Testing Production Build
```bash
npm run build        # Must succeed
npm run start        # Start production server
# Visit http://localhost:3000
# Should feel responsive
```

### Testing on Vercel
1. Push to GitHub branch
2. Deploy via Vercel Dashboard
3. Monitor build logs for errors
4. Verify preview URL works

---

## Rollback Instructions

If the build still fails, quickly rollback:

```bash
git diff frontend/src/app/layout.tsx  # Review changes
git checkout frontend/src/app/layout.tsx  # Revert layout
git checkout frontend/next.config.ts      # Revert config
```

---

## Prevention Checklist

For future development:

- [ ] Never import client-only modules in Server Components
- [ ] Always use `'use client'` in components that use hooks or browser APIs
- [ ] Use `dynamic()` for components with WASM/browser dependencies
- [ ] Test build locally before pushing: `npm run build`
- [ ] Review import statements when adding new packages
- [ ] Check next.config.ts for proper externalization
- [ ] Monitor build logs on Vercel deployments

---

## Common Related Issues

### Issue: "Module has no exported member 'X'"
**Cause**: Default vs named export mismatch
**Fix**: Use `.then(mod => mod.ComponentName)` in dynamic import

### Issue: "ReferenceError: window is not defined"
**Cause**: Browser API used in server context
**Fix**: Wrap in `typeof window !== 'undefined'` check or use dynamic import

### Issue: CSS not loading from wallet packages
**Cause**: CSS imports in client-only modules
**Fix**: Ensure css files are imported after dynamic load or in client components

### Issue: Wallet state lost after page navigation
**Cause**: Provider not wrapping all routes
**Fix**: Keep provider at root layout level

---

## Support Resources

- [Next.js Dynamic Imports](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading)
- [Next.js Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [External Packages Documentation](https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages)
- Aleo Wallet Adapter Documentation: Check GitHub repos for latest docs

---

## Summary of Changes

| File | Change | Reason |
|------|--------|--------|
| `src/app/layout.tsx` | Changed to dynamic import with `ssr: false` | Prevent server-side module resolution |
| `next.config.ts` | Added `@demox-labs/aleo-wallet-adapter-reactui` to external packages | Ensure all wallet packages are external |

**Build Command**: `npm run build` should now succeed.
**Deploy**: Push to GitHub and deploy to Vercel for final validation.
