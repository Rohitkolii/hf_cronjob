# Cron Job Service (Vercel + Firestore + Nodemailer)

This project runs a daily Vercel Scheduled Function that:

- Reads Firestore data
- Generates Excel file (ExcelJS)
- Sends email using Nodemailer
- Works independently from main website
- No frontend needed

## Main API Path

**Endpoint:** `/api/daily-report`

**Methods:** GET or POST (both supported)

**Description:** Generates daily enquiry reports from Firestore, creates Excel files, and sends them via email.

**Cron Schedule:** Runs automatically at **10:30 PM IST** (5:00 PM UTC) daily

**Manual Trigger:** You can manually trigger the endpoint by making a GET or POST request to:
```
https://your-vercel-domain.vercel.app/api/daily-report
```

**Local Testing:**
```bash
curl http://localhost:3000/api/daily-report
```

## Folder Structure

```
src/
  app/
    api/
      daily-report/
        route.js    # Main API route handler
```

## Configuration

### Cron Schedule

The cron job is configured in `vercel.json`:
- **Schedule:** `0 17 * * *` (5:00 PM UTC / 10:30 PM IST)
- **Path:** `/api/daily-report`

### Environment Variables Required

Make sure to set these in your Vercel project settings:

- `FIREBASE_ADMIN_KEY` - Firebase Admin SDK service account JSON (stringified)
- `EMAIL_USER` - Gmail address for sending emails
- `EMAIL_PASS` - Gmail app-specific password

### Email Recipients

Currently hardcoded in `route.js`:
- rohitkolisd@gmail.com
- kamalk@appsobytes.com

## How It Works

1. Fetches all enquiries from Firestore collection "enquiries"
2. Filters enquiries from yesterday (IST timezone)
3. Generates two Excel files:
   - All enquiries (complete dataset)
   - Yesterday's enquiries only
4. Sends email with both Excel files attached
5. Email subject includes date stamp

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (see Configuration section above)

3. Run locally:
```bash
npm run dev
```

## Deployment

Deploy to Vercel and the cron job will automatically run at the scheduled time.

**Important:** After deploying, make sure:
- All environment variables are set in Vercel project settings
- The deployment completed successfully
- The cron job appears in Vercel dashboard under "Crons"

## Troubleshooting

### 404 NOT_FOUND Error After Deployment

If you're getting a 404 error on Vercel but it works locally:

1. **Verify the route exists:** The file should be at `src/app/api/daily-report/route.js` ✓
2. **Check Vercel Project Settings:**
   - Go to Vercel Dashboard → Your Project → Settings → General
   - Verify **Framework Preset** is set to **"Next.js"**
   - Verify **Root Directory** is set correctly (usually just `/`)
   - Verify **Build Command** is `next build` (or leave default)
   - Verify **Output Directory** is `.next` (or leave default)

3. **Check Deployment:**
   - Ensure the latest code is deployed to Vercel
   - Go to Deployments tab and check build logs for errors
   - Look for any warnings about API routes

4. **Verify Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Ensure all required variables are set: `FIREBASE_ADMIN_KEY`, `EMAIL_USER`, `EMAIL_PASS`

5. **Check Function Logs:**
   - Go to Vercel Dashboard → Deployments → Select latest deployment → Functions tab
   - Look for `/api/daily-report` in the functions list
   - Check Runtime Logs for any errors

6. **Test the endpoint manually:**
   ```bash
   curl https://your-domain.vercel.app/api/daily-report
   ```

7. **Force a fresh deployment:**
   - In Vercel Dashboard, go to Deployments
   - Click on the latest deployment → "..." menu → "Redeploy"
   - Or push a new commit to trigger a rebuild

8. **Verify route configuration:**
   - Route file: `src/app/api/daily-report/route.js` ✓
   - URL path: `/api/daily-report` ✓
   - Vercel config: `"path": "/api/daily-report"` ✓
   - Runtime: `nodejs` (configured in route file) ✓
   - Both GET and POST handlers exported ✓

### Important Notes

- **No `pages` directory:** Make sure there's no `pages` directory in your project root, as it can conflict with App Router
- **App Router structure:** The route uses Next.js App Router format (`src/app/api/...`)
- **Runtime configuration:** The route has `export const runtime = 'nodejs'` for Vercel serverless functions
- **Function timeout:** Configured to 60 seconds max duration in `vercel.json`

