# Next.js White Screen Troubleshooting Guide

## Overview
This guide provides a systematic approach to diagnosing and fixing white screen issues in Next.js applications. The Aura Protocol frontend was experiencing this problem due to dependency conflicts and missing native modules.

---

## Root Cause Analysis: What Was Wrong

### Issue #1: Dependency Version Mismatch
**Problem:** Root `package.json` specified incompatible versions with frontend workspace:
- Root: `next@^16.2.1`, `tailwindcss@^4.2.2`
- Frontend: `next@15.1.7`, `tailwindcss@^3.4.14`

**Impact:** npm couldn't resolve dependencies correctly, causing build failures

### Issue #2: React Version Conflict
**Problem:** Wallet adapters require `react@^18.2.0` but dependencies weren't aligned
**Impact:** Peer dependency resolution failures

### Issue #3: Missing lightningcss Native Module
**Problem:** Tailwind CSS v4 requires compiled `lightningcss` binary which wasn't being built properly
**Impact:** CSS processing failed, resulting in styling errors and white screen

---

## Diagnostic Checklist

### 1. Check Build Logs
```bash
# Look for these error patterns:
- "ERESOLVE unable to resolve dependency tree"
- "Cannot find module 'lightningcss'"
- "peer react mismatch"
- "Error evaluating Node.js code"
```

### 2. Verify Dependencies
```bash
# In frontend directory:
npm ls react              # Check React version
npm ls next              # Check Next.js version
npm ls tailwindcss       # Check Tailwind version
npm ls @demox-labs/*     # Check wallet adapters
```

### 3. Test CSS Processing
```bash
# Check if CSS files are being processed correctly
npm run build
# Look for CSS-related errors in the build output
```

### 4. Validate Configuration Files
- `next.config.ts` - Webpack/Turbopack settings
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.mjs` - PostCSS plugins
- `tsconfig.json` - TypeScript settings

### 5. Check Component Rendering
```javascript
// Add debug logging to catch component errors
console.log("[v0] Rendering layout...");
console.log("[v0] Rendering page...");
```

---

## Common Issues & Solutions

### White Screen Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| CSS not loading | Missing Tailwind CSS directive | Add `@tailwind` directives to globals.css |
| CSS processing error | Wrong Tailwind version | Align versions between root and frontend |
| Missing styles | Turbopack/Webpack conflict | Ensure consistent Next.js version |
| Component errors | Uncaught exceptions | Check browser console for errors |

### Dependency Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| npm ERESOLVE error | Version conflicts | Update root package.json to match frontend |
| lightningcss missing | Tailwind CSS v4 setup | Use Tailwind CSS v3 or ensure proper build |
| Peer dependency error | React/adapter mismatch | Align all packages to use React 18 |

### Build Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Build fails | Configuration mismatch | Align next.config.ts with Next.js version |
| Slow builds | Turbopack issues | Disable Turbopack if using webpack configs |
| TypeScript errors | Version mismatch | Update @types/react and @types/react-dom |

---

## Step-by-Step Debugging Process

### Level 1: Environment Check
```bash
# Check Node.js version
node --version          # Should be >= 18.17.0

# Verify npm version
npm --version

# Check installed versions
npm ls -g next
npm ls -g tailwindcss
```

### Level 2: Dependency Check
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# If ERESOLVE errors occur:
npm install --legacy-peer-deps
```

### Level 3: Build Check
```bash
# Build the project
npm run build

# Check for errors:
# - CSS processing errors
# - Module resolution errors
# - TypeScript errors
```

### Level 4: Runtime Check
```bash
# Start development server
npm run dev

# Check:
# - Browser console for errors
# - Network tab for failed requests
# - Application tab for component rendering
```

### Level 5: Component Check
```bash
# Enable debug logging in components
// In layout.tsx
console.log("[v0] Layout component mounted");

// In page.tsx
console.log("[v0] Page component mounted");

// Check browser console for these logs
```

---

## Verification Steps

### After Fixing Dependencies
1. Delete `node_modules` and lock files
2. Run `npm install`
3. Verify no ERESOLVE errors
4. Run `npm run build` successfully
5. Check `npm ls` for correct versions

### After Fixing Configuration
1. Verify `next.config.ts` matches Next.js version
2. Verify `tailwind.config.ts` exists and is correct
3. Verify `postcss.config.mjs` has proper plugins
4. Run build: `npm run build`

### After Starting Development Server
1. Run `npm run dev`
2. Open browser DevTools (F12)
3. Check Console tab for errors
4. Check Network tab for failed requests
5. Verify page renders (not white screen)

---

## Environment-Specific Checks

### Development Environment
- Use `npm run dev` for hot module replacement
- Check browser console for real-time errors
- Use React DevTools to inspect component tree
- Enable debug logging with console.log statements

### Production Build
- Run `npm run build` to check for build errors
- Run `npm run start` to test production build locally
- Check `.next` directory for build artifacts
- Look for critical errors that only appear in production

### Deployment Environment (Vercel)
- Check build logs in Vercel dashboard
- Verify environment variables are set
- Check deployment-specific error logs
- Test preview URL before merging to main

---

## Prevention Checklist

- ✅ Keep root and workspace package.json versions aligned
- ✅ Use `npm ls` regularly to check for version conflicts
- ✅ Test builds locally before pushing to git
- ✅ Review dependency updates before upgrading major versions
- ✅ Add debug logging to catch runtime errors early
- ✅ Use TypeScript strict mode to catch type errors
- ✅ Document any custom webpack/Turbopack configurations
- ✅ Keep Node.js version current (>= 18.17.0)

---

## Quick Reference Commands

```bash
# Check for issues
npm ls --depth=0           # Top-level dependencies
npm audit                  # Security vulnerabilities
npm outdated               # Outdated packages

# Clean and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Build and test
npm run build              # Check for build errors
npm run dev                # Test development server
npm run start              # Test production build

# Debug
npm ls react               # Check React version
npm ls next                # Check Next.js version
npm ls tailwindcss         # Check Tailwind version
```

---

## File Structure to Verify

```
frontend/
├── package.json           # Frontend-specific dependencies
├── next.config.ts         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── postcss.config.mjs      # PostCSS configuration
├── tsconfig.json          # TypeScript configuration
├── .npmrc                 # npm configuration
├── src/
│   └── app/
│       ├── layout.tsx     # Root layout
│       ├── page.tsx       # Home page
│       ├── globals.css    # Global styles
│       └── components/    # React components
└── .next/                 # Build output (check if exists)

root/
├── package.json           # Workspace configuration
└── package-lock.json      # Lock file
```

---

## When to Escalate

If after following this guide the issue persists:
1. Check Vercel build logs for deployment-specific errors
2. Review browser DevTools Network tab for resource loading failures
3. Check for environment variable issues
4. Verify all required environment variables are set
5. Open a support ticket at vercel.com/help with:
   - Full build/error logs
   - Current package.json versions
   - Steps to reproduce
   - Browser/environment information

---

## Related Documentation

- [Next.js Official Docs](https://nextjs.org/docs)
- [Tailwind CSS v3 Docs](https://v3.tailwindcss.com)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/29/react-v18)
- [npm ERESOLVE Resolution](https://docs.npmjs.com/cli/v8/using-npm/npm-ls)
