

// src/app/utils/invoiceGenerator.ts
import PDFDocument from "pdfkit";
import { AppError } from "../../errors";

export interface InvoiceData {
  transactionId: string;
  amount: number;
  bookingId: string;
  guestCount: number;
  date: Date;
  tourTitle: string;
  user: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

// Colors
const COLORS = {
  primary: "#2c5aa0",
  secondary: "#6c757d",
  success: "#28a745",
  lightGray: "#f8f9fa",
  border: "#dee2e6",
  text: "#212529",
};

// Company Info
const COMPANY_INFO = {
  name: "World Tour",
  address: "Dhaka",
  phone: "+1 (555) 123-TOUR",
  email: "worldtour@gmail.com",
  website: "www.worldtour.com",
};

export const generatePDF = async (data: InvoiceData): Promise<Buffer> => {
  if (!data) throw new AppError("Invoice data is required");

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: "A4",
        margin: 50,
        bufferPages: true,
      });

      const chunks: Buffer[] = [];
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);

      // Sections
      addHeader(doc);
      addInvoiceDetails(doc, data);
      addBillingAndTourInfo(doc, data);
      addTransactionTable(doc, data);
      addFooter(doc);

      doc.end();
    } catch (err) {
      reject(new AppError("PDF generation failed"));
    }
  });
};

/**
 * HEADER
 */
const addHeader = (doc: PDFKit.PDFDocument) => {
  // Header background
  doc.rect(0, 0, doc.page.width, 100).fill(COLORS.primary);

  // Company info
  doc.fillColor("#fff").fontSize(22).font("Helvetica-Bold").text(COMPANY_INFO.name, 50, 35);

  doc.fontSize(9).font("Helvetica").text(COMPANY_INFO.address, 50, 65).text(
    `Phone: ${COMPANY_INFO.phone} | Email: ${COMPANY_INFO.email}`,
    50,
    78
  );

  // Invoice title on right
  doc.fontSize(20)
    .font("Helvetica-Bold")
    .text("INVOICE", -50, 40, { align: "right" });

  doc.moveDown(3);
};

/**
 * INVOICE DETAILS
 */
const addInvoiceDetails = (doc: PDFKit.PDFDocument, data: InvoiceData) => {
  doc.fillColor(COLORS.text).fontSize(11);

  const startY = 120;

  doc.font("Helvetica-Bold").text("Invoice Number:", 50, startY).font("Helvetica").text(data.transactionId, 160, startY);

  doc.font("Helvetica-Bold").text("Invoice Date:", 50, startY + 18).font("Helvetica").text(
    data.date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    160,
    startY + 18
  );

  doc.font("Helvetica-Bold").text("Booking ID:", 50, startY + 36).font("Helvetica").text(data.bookingId, 160, startY + 36);

  doc.moveDown(5);
};

/**
 * BILLING + TOUR DETAILS
 */
const addBillingAndTourInfo = (doc: PDFKit.PDFDocument, data: InvoiceData) => {
  const y = doc.y;

  // Box background
  doc.rect(50, y, doc.page.width - 100, 90).fill(COLORS.lightGray).stroke();

  // Billed To
  doc.fillColor(COLORS.text).fontSize(12).font("Helvetica-Bold").text("BILLED TO", 65, y + 12);

  doc.fontSize(10)
    .font("Helvetica-Bold")
    .text(data.user.name, 65, y + 30)
    .font("Helvetica")
    .text(data.user.email, 65, y + 44);

  if (data.user.phone) doc.text(`Phone: ${data.user.phone}`, 65, y + 58);
  if (data.user.address) doc.text(`Address: ${data.user.address}`, 65, y + 72);

  // Tour details right side
  const rightX = doc.page.width - 250;
  doc.fontSize(12).font("Helvetica-Bold").text("TOUR DETAILS", rightX, y + 12);

  doc.fontSize(10).font("Helvetica").text(data.tourTitle, rightX, y + 30).text(`Guests: ${data.guestCount}`, rightX, y + 44);

  doc.moveDown(7);
};

/**
 * TRANSACTION TABLE
 */
const addTransactionTable = (doc: PDFKit.PDFDocument, data: InvoiceData) => {
  const startY = doc.y;

  const itemX = 60;
  const amountX = doc.page.width - 150;

  // Table headers
  doc.fillColor(COLORS.primary)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("DESCRIPTION", itemX, startY)
    .text("AMOUNT", amountX, startY);

  doc.moveTo(itemX, startY + 15).lineTo(doc.page.width - 60, startY + 15).strokeColor(COLORS.border).lineWidth(1).stroke();

  // Table content
  doc.fillColor(COLORS.text)
    .fontSize(10)
    .font("Helvetica")
    .text(data.tourTitle, itemX, startY + 28)
    .text(`${data.guestCount} Guest(s)`, itemX, startY + 42)
    .font("Helvetica-Bold")
    .text(`BDT ${data.amount.toLocaleString()}`, amountX, startY + 28);

  // Total
  const totalY = startY + 80;
  doc.moveTo(itemX, totalY - 8).lineTo(doc.page.width - 60, totalY - 8).strokeColor(COLORS.border).lineWidth(1).stroke();

  doc.fontSize(12)
    .font("Helvetica-Bold")
    .text("TOTAL", amountX - 100, totalY)
    .text(`BDT ${data.amount.toLocaleString()}`, amountX, totalY);

  // Payment status
  doc.fillColor(COLORS.success).fontSize(10).text("✓ Payment Successful", amountX, totalY + 18);

  doc.moveDown(5);
};

/**
 * FOOTER
 */
const addFooter = (doc: PDFKit.PDFDocument) => {
  const footerY = doc.page.height - 100;

  doc.fillColor(COLORS.secondary)
    .fontSize(11)
    .font("Helvetica-Bold")
    .text("Thank you for your booking!", 0, footerY, { align: "center" });

  doc.fontSize(9)
    .font("Helvetica")
    .text("If you have any questions about this invoice, please contact our customer support.", 0, footerY + 16, { align: "center" })
    .text("Terms & Conditions: This is a computer-generated invoice and does not require a signature.", 0, footerY + 32, { align: "center" });

  // Page numbers
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(8).fillColor(COLORS.secondary).text(`Page ${i + 1} of ${pageCount}`, 0, doc.page.height - 20, { align: "center" });
  }
};
