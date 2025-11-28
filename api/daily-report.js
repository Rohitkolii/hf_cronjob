import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
  });
}

export default async function handler(req, res) {
  try {
    // 1. Fetch Firestore Data
    const db = admin.firestore();
    const snapshot = await db.collection("enquiries").get();
    const rows = snapshot.docs.map(doc => doc.data());

    // 2. Convert to Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Report");

    sheet.columns = [
      { header: "Name", key: "name", width: 20 },
      { header: "Email", key: "email", width: 30 },
      { header: "Message", key: "message", width: 40 },
      { header: "Date", key: "date", width: 20 }
    ];

    sheet.addRows(rows);

    const buffer = await workbook.xlsx.writeBuffer();

    // 3. Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // user: process.env.EMAIL_USER,
        user: "rk112koli@gmail.com",
        pass: process.env.EMAIL_PASS,
        pass: "ygzr rbzb ukry mheq"
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ["rohitkolisd@gmail.com", "rk112koli@gmail.com"],
      subject: "Daily Firestore Report",
      text: "Attached is the daily report.",
      attachments: [
        {
          filename: "report.xlsx",
          content: buffer
        }
      ]
    });

    return res.status(200).json({ success: true, message: "Cron executed" });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
}
