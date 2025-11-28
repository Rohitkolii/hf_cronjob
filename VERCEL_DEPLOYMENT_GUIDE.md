# Vercel Deployment Guide - No 404 Errors

## ✅ Configuration Verified

### 1. Route Location
- ✅ **File:** `pages/api/daily-report.js`
- ✅ **Format:** Pages Router (most reliable on Vercel)
- ✅ **Path:** `/api/daily-report`

### 2. Vercel Configuration (`vercel.json`)
```json
{
  "functions": {
    "pages/api/**/*.js": {
      "runtime": "nodejs18.x",
      "maxDuration": 60
    }
  },
  "crons": [
    {
      "path": "/api/daily-report",
      "schedule": "25 23 * * *"
    }
  ]
}
```

### 3. Next.js Configuration
- ✅ Framework: Next.js 15
- ✅ Router: Pages Router for API routes
- ✅ Build: Standard Next.js build

## 🚀 Deployment Steps

### Step 1: Verify Files Are Correct
```bash
# Verify route exists
ls pages/api/daily-report.js

# Verify vercel.json exists
cat vercel.json
```

### Step 2: Commit and Push
```bash
git add .
git commit -m "Fix: Pages Router API route for Vercel deployment"
git push
```

### Step 3: Verify Vercel Project Settings

Go to **Vercel Dashboard → Your Project → Settings → General**:

1. **Framework Preset:** Must be **"Next.js"** (not "Other")
2. **Root Directory:** `/` (root)
3. **Build Command:** `next build` (default)
4. **Output Directory:** `.next` (default)
5. **Install Command:** `npm install` (default)

### Step 4: Check Deployment

After deployment completes:

1. **Check Functions Tab:**
   - Go to: Deployments → Latest Deployment → **Functions** tab
   - You **MUST** see: `/api/daily-report` listed
   - If missing, the route wasn't deployed correctly

2. **Test the Endpoint:**
   ```
   https://your-domain.vercel.app/api/daily-report
   ```
   Should return: `{"success": true, "message": "Daily report email dispatched"}`

3. **Check Cron Job:**
   - Go to: Settings → **Cron Jobs**
   - Verify cron is listed with schedule: `25 23 * * *` (11:25 PM IST)

### Step 5: Verify Environment Variables

Go to **Settings → Environment Variables**, ensure these are set:
- ✅ `FIREBASE_ADMIN_KEY` (Firebase service account JSON stringified)
- ✅ `EMAIL_USER` (Gmail address)
- ✅ `EMAIL_PASS` (Gmail app password)

## 🔍 Troubleshooting 404 Errors

### If route returns 404 after deployment:

1. **Check Functions Tab:**
   - If `/api/daily-report` is NOT in Functions tab:
     - Framework Preset is wrong → Change to "Next.js"
     - Route file is missing → Verify `pages/api/daily-report.js` exists
     - Build failed → Check build logs

2. **Check Build Logs:**
   - Deployments → Latest → Build Logs
   - Look for errors about API routes
   - Ensure build completed successfully

3. **Check Runtime Logs:**
   - Deployments → Latest → Runtime Logs
   - Try accessing endpoint and check for errors

4. **Verify Route File:**
   ```bash
   # Route must export default handler
   cat pages/api/daily-report.js | grep "export default"
   ```

5. **Clear Cache and Redeploy:**
   - In Vercel Dashboard → Deployments
   - Click "..." → "Redeploy"
   - Or push an empty commit to trigger rebuild

## ✅ Why This Will Work

1. **Pages Router Format:** Most reliable for Vercel API routes
2. **Correct Location:** `pages/api/` is the standard location Vercel expects
3. **Proper Handler:** Uses `export default async function handler(req, res)`
4. **Vercel Config:** Functions configuration properly set in `vercel.json`
5. **Runtime:** Node.js 18.x explicitly configured

## 📋 Pre-Deployment Checklist

- [ ] `pages/api/daily-report.js` exists and exports default handler
- [ ] `vercel.json` has functions and crons configuration
- [ ] Framework Preset is set to "Next.js" in Vercel Dashboard
- [ ] All environment variables are set in Vercel
- [ ] Route file has no syntax errors
- [ ] Build completes successfully

## 🎯 Expected Behavior

After successful deployment:
1. Route appears in Functions tab
2. Manual GET request works: `curl https://your-domain.vercel.app/api/daily-report`
3. Cron job runs automatically at 11:25 PM IST daily
4. Email is sent with Excel reports attached

---

**If you still get 404 after following this guide:**
1. Share screenshot of Functions tab
2. Share build logs
3. Share runtime logs when accessing the endpoint

