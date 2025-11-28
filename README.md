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

### 404 NOT_FOUND Error

If you're getting a 404 error:

1. **Verify the route exists:** The file should be at `src/app/api/daily-report/route.js`
2. **Check deployment:** Ensure the latest code is deployed to Vercel
3. **Verify dependencies:** Make sure `next` is installed (`npm install`)
4. **Check Vercel logs:** Go to your Vercel dashboard → Deployments → Function Logs
5. **Test manually:** Try accessing the endpoint directly in your browser or via curl
6. **Rebuild:** Sometimes a rebuild is needed after adding new routes - trigger a new deployment

### Route Path

The route path in `vercel.json` must match the actual route:
- Route file: `src/app/api/daily-report/route.js`
- URL path: `/api/daily-report`
- Vercel config: `"path": "/api/daily-report"` ✓

