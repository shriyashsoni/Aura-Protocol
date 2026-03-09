# Vercel Deployment Checklist

## Pre-Deployment Verification

- [x] All API routes created and tested locally
- [x] Frontend successfully connects to backend APIs
- [x] Environment variables defined in `.env.example`
- [x] TypeScript compilation passes (`npm run type-check`)
- [x] ESLint checks pass (`npm run lint`)
- [x] Production build succeeds locally (`npm run build`)

## Vercel Deployment Steps

### 1. Push Code to GitHub
```bash
git add .
git commit -m "feat: unified backend and frontend integration ready for production"
git push origin connect-front-and-backend
```

### 2. Create Pull Request
- Go to [GitHub Repository](https://github.com/shriyashsoni/Aura-Protocol)
- Create PR from `connect-front-and-backend` to `master`
- This will trigger preview deployment automatically

### 3. Wait for Preview Deployment
Vercel will:
- Automatically build your Next.js app
- Create a preview URL
- Show build logs for any issues
- Provide preview deployment status

### 4. Review Preview Deployment
- Check all pages load correctly
- Test API endpoints are responding
- Verify marketplace functionality
- Test forms and interactions

### 5. Configure Production Environment Variables

In Vercel Dashboard:
1. Go to Settings → Environment Variables
2. Add variables from `.env.example`:
   ```
   DATABASE_URL=...          (if using database)
   API_KEY=...              (if using external APIs)
   NEXT_PUBLIC_API_URL=...  (frontend API endpoint)
   ```

### 6. Merge to Master for Production

Once preview looks good:
```bash
# In GitHub UI or CLI
git checkout master
git pull
git merge connect-front-and-backend
git push origin master
```

Vercel will automatically:
- Build production version
- Deploy to https://your-domain.vercel.app
- Update all API routes
- Make marketplace live

## Post-Deployment Verification

### Check Production Build
- Visit your Vercel production URL
- Verify all pages load
- Test API endpoints: `GET /api/v1/health`
- Check marketplace listings load

### Monitor Performance
- Check Vercel Analytics
- Monitor API response times
- Watch error logs in Vercel dashboard

### Verify API Connectivity
```bash
curl https://your-app.vercel.app/api/v1/health
# Should return: { "status": "ok" }
```

## Common Issues & Fixes

### Build Fails with TypeScript Errors
- Fix type issues locally: `npm run type-check`
- Ensure all imports are correct
- Check environment variables are declared

### API Routes Return 404
- Verify route structure: `/app/api/v1/[resource]/route.ts`
- Check file naming is exactly `route.ts`
- Ensure proper exports: `export async function GET/POST/etc`

### Environment Variables Not Found
- Go to Vercel Dashboard → Settings → Environment Variables
- Ensure variable names exactly match code
- Rebuild deployment after adding variables
- Use `NEXT_PUBLIC_` prefix for client-side vars

### CORS Issues
- Not needed for same-origin requests (frontend → API on same domain)
- If needed, add headers in `next.config.ts`

## Rollback Plan

If production has critical issues:

```bash
# Revert to previous commit
git revert HEAD
git push origin master

# Vercel will automatically rebuild and deploy
```

## Monitoring & Maintenance

### Daily Checks
- Monitor Vercel deployment status
- Check error logs
- Monitor API health endpoint

### Weekly Checks
- Review performance metrics
- Check for failing API calls
- Monitor database/backend performance

### Monthly Checks
- Review cost/usage
- Update dependencies
- Run security audit: `npm audit`

## Success Indicators

You'll know deployment was successful when:

✅ Production URL is live and accessible
✅ All pages render without errors
✅ API endpoints respond correctly
✅ Marketplace listings display
✅ No console errors in browser
✅ Vercel analytics show traffic
✅ API error logs are clean

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Vercel Analytics](https://vercel.com/analytics)

## Support

If deployment fails:
1. Check Vercel build logs
2. Review the DEPLOYMENT.md guide
3. Verify environment variables
4. Check GitHub Issues
5. Contact Vercel Support

---

**Ready to deploy? Create that PR now!** 🚀
