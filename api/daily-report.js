import ExcelJS from "exceljs";
import nodemailer from "nodemailer";
import admin from "firebase-admin";

const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const RECIPIENTS = ["rohitkolisd@gmail.com", "kamal@appsobytes.com"];

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const toDate = value => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value.toDate === "function") return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeRecord = record => {
  const output = {};
  Object.entries(record).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      output[key] = "";
      return;
    }
    if (value instanceof Date) {
      output[key] = value.toISOString();
      return;
    }
    if (typeof value === "object") {
      if (typeof value.toDate === "function") {
        output[key] = value.toDate().toISOString();
        return;
      }
      output[key] = JSON.stringify(value);
      return;
    }
    output[key] = value;
  });
  return output;
};

const getYesterdayIstRange = () => {
  const nowUtc = Date.now();
  const nowIst = nowUtc + IST_OFFSET_MS;
  const istDate = new Date(nowIst);
  const todayIstStartLocal = new Date(
    istDate.getFullYear(),
    istDate.getMonth(),
    istDate.getDate()
  );
  const todayIstStartUtc = todayIstStartLocal.getTime() - IST_OFFSET_MS;
  const start = todayIstStartUtc - 24 * 60 * 60 * 1000;
  const end = todayIstStartUtc - 1;

  return { start, end };
};

const buildWorkbookBuffer = async (rows, sheetName) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  if (!rows.length) {
    sheet.addRow(["No enquiries in this timeframe"]);
    return workbook.xlsx.writeBuffer();
  }

  const columnKeys = Array.from(
    rows.reduce((set, row) => {
      Object.keys(row).forEach(key => set.add(key));
      return set;
    }, new Set())
  );

  sheet.columns = columnKeys.map(key => ({
    header: key,
    key,
    width: Math.min(Math.max(key.length + 5, 15), 40)
  }));

  sheet.addRows(rows);

  return workbook.xlsx.writeBuffer();
};

const buildEmailSummary = (allRows, yesterdayRows, nowIst) => {
  const dateString = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Asia/Kolkata"
  }).format(nowIst);

  return [
    "Hi team,",
    "",
    `Daily enquiries snapshot as of ${dateString}:`,
    `• Total records: ${allRows.length}`,
    `• Yesterday's records: ${yesterdayRows.length}`,
    "",
    "Both Excel reports are attached.",
    "",
    "Regards,",
    "hf_cronjob bot"
  ].join("\n");
};

export default async function handler(req, res) {
  try {
    const db = admin.firestore();
    const snapshot = await db.collection("enquiries").get();

    const { start, end } = getYesterdayIstRange();

    const normalizedRows = snapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = toDate(data.createdAt);
      const normalized = normalizeRecord({ id: doc.id, ...data });
      if (createdAt) {
        normalized.createdAt = createdAt.toISOString();
      }
      return {
        normalized,
        createdAtMs: createdAt ? createdAt.getTime() : null
      };
    });

    const allRows = normalizedRows.map(entry => entry.normalized);
    const yesterdayRows = normalizedRows
      .filter(entry => {
        if (!entry.createdAtMs) return false;
        return entry.createdAtMs >= start && entry.createdAtMs <= end;
      })
      .map(entry => entry.normalized);

    const nowIst = new Date(Date.now() + IST_OFFSET_MS);
    const dateStamp = nowIst.toISOString().split("T")[0];

    const [allBuffer, yesterdayBuffer] = await Promise.all([
      buildWorkbookBuffer(allRows, "All Enquiries"),
      buildWorkbookBuffer(yesterdayRows, "Yesterday Only")
    ]);

    const summary = buildEmailSummary(allRows, yesterdayRows, nowIst);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: RECIPIENTS,
      subject: `Daily Firestore Enquiries Report | ${dateStamp}`,
      text: summary,
      attachments: [
        {
          filename: `enquiries-all-${dateStamp}.xlsx`,
          content: allBuffer
        },
        {
          filename: `enquiries-yesterday-${dateStamp}.xlsx`,
          content: yesterdayBuffer
        }
      ]
    });

    return res.status(200).json({
      success: true,
      message: "Daily report email dispatched"
    });
  } catch (err) {
    console.error("daily-report error", err);
    return res.status(500).json({ error: err.message });
  }
}
