# Cron Job Service (Vercel + Firestore + Nodemailer)

This project runs a daily Vercel Scheduled Function that:

- Reads Firestore data
- Generates Excel file (ExcelJS)
- Sends email using Nodemailer
- Works independently from main website
- No frontend needed

## Main API Path

**Endpoint:** `/api/daily-report`

**Method:** GET

**Description:** Generates daily enquiry reports from Firestore, creates Excel files, and sends them via email.

**Cron Schedule:** Runs automatically at **10:30 PM IST** (5:00 PM UTC) daily

**Manual Trigger:** You can manually trigger the endpoint by making a GET request to:
```
https://your-vercel-domain.vercel.app/api/daily-report
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

## Deployment

Deploy to Vercel and the cron job will automatically run at the scheduled time.

To test locally, you can run:
```bash
curl http://localhost:3000/api/daily-report
```

