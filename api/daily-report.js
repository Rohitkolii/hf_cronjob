import * as admin from "firebase-admin";
import nodemailer from "nodemailer";
import ExcelJS from "exceljs";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY)),
  });
}

export default async function handler(req, res) {
  try {
    const db = admin.firestore();

    // 🔥 Read Firestore collection
    const snapshot = await db.collection("your-collection").get();

    // 📘 Create Excel file
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data");

    sheet.columns = [
      { header: "Field1", key: "field1" },
      { header: "Field2", key: "field2" },
      { header: "Field3", key: "field3" }
    ];

    snapshot.forEach(doc => sheet.addRow(doc.data()));

    const buffer = await workbook.xlsx.writeBuffer();

    // 📧 Email setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.EMAIL,
      subject: "Daily Firestore Report",
      text: "Attached is your daily Firestore report.",
      attachments: [{ filename: "report.xlsx", content: buffer }]
    });

    return res.status(200).json({ message: "Email sent successfully" });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
