# Vercel Deployment Checklist for 404 Fix

## Critical Steps to Fix 404 Error

### 1. Verify Vercel Project Settings
Go to **Vercel Dashboard → Your Project → Settings → General**:
- ✅ **Framework Preset:** Must be set to **"Next.js"** (not "Other")
- ✅ **Root Directory:** Should be `/` (root)
- ✅ **Build Command:** Should be `next build` (or leave default)
- ✅ **Output Directory:** Should be `.next` (or leave default)
- ✅ **Install Command:** Should be `npm install` (or leave default)

### 2. Verify Route File Location
- ✅ File must be at: `src/app/api/daily-report/route.js`
- ✅ File must export `GET` and `POST` handlers
- ✅ File must have route segment config: `export const runtime = 'nodejs'`

### 3. Verify vercel.json Configuration
Current config should be:
```json
{
  "crons": [
    {
      "path": "/api/daily-report",
      "schedule": "45 23 * * *"
    }
  ]
}
```

### 4. Check Build Logs
After deployment, check:
- Go to **Deployments → Latest Deployment**
- Look for any errors or warnings
- Check if the route is mentioned in build output

### 5. Check Functions Tab
- Go to **Deployments → Latest Deployment → Functions** tab
- Look for `/api/daily-report` in the list
- If it's missing, the route isn't being built correctly

### 6. Test the Endpoint
After deployment:
```bash
curl https://your-domain.vercel.app/api/daily-report
```

Or visit in browser:
```
https://your-domain.vercel.app/api/daily-report
```

### 7. Check Runtime Logs
- Go to **Deployments → Latest Deployment → Runtime Logs**
- Try accessing the endpoint
- Look for any errors when the cron job runs or when you manually test

### 8. Common Issues

#### Issue: Route not in Functions tab
**Solution:** 
- Verify Framework Preset is "Next.js"
- Check that route file is at `src/app/api/daily-report/route.js`
- Ensure file exports GET and POST handlers
- Redeploy

#### Issue: Build succeeds but route returns 404
**Solution:**
- Wait 1-2 minutes for deployment to fully propagate
- Clear browser cache
- Try accessing via curl
- Check Runtime Logs for errors

#### Issue: Cron job returns 404
**Solution:**
- Verify cron path matches route: `/api/daily-report`
- Check that route exports POST handler
- Verify cron job appears in Vercel Dashboard → Settings → Cron Jobs

### 9. Nuclear Option: Complete Rebuild
If nothing works:
1. Delete `.next` folder locally (if exists)
2. Delete `.vercel` folder locally (if exists)
3. In Vercel Dashboard, go to Settings → Delete Project
4. Create new project and redeploy
5. Set all environment variables again

## Current Configuration Summary

- ✅ Route: `src/app/api/daily-report/route.js`
- ✅ Runtime: Node.js
- ✅ Dynamic: force-dynamic
- ✅ Max Duration: 60 seconds
- ✅ Cron Schedule: 45 23 * * * (11:45 PM IST)
- ✅ Handlers: GET and POST

## Still Not Working?

1. **Check Vercel Support:** Create a support ticket with:
   - Deployment URL
   - Build logs
   - Function logs
   - Screenshot of Functions tab

2. **Verify Environment Variables:**
   - `FIREBASE_ADMIN_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - All must be set in Vercel Dashboard → Settings → Environment Variables

3. **Test Locally First:**
   ```bash
   npm run build
   npm start
   # Then visit http://localhost:3000/api/daily-report
   ```
   If it works locally but not on Vercel, it's a deployment issue.

