// src/app/utils/invoiceGenerator.ts
import PDFDocument from 'pdfkit';
import { AppError } from '../../errors';

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

export const generatePDF = async (data: InvoiceData): Promise<Buffer> => {
  if (!data) throw new AppError("Invoice data is required");

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add content
      doc.fontSize(20).text('Payment Invoice', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12)
        .text(`Transaction ID: ${data.transactionId}`)
        .text(`Booking ID: ${data.bookingId}`)
        .text(`Tour: ${data.tourTitle}`)
        .text(`Amount: ${data.amount} BDT`)
        .text(`Guest Count: ${data.guestCount}`)
        .text(`Date: ${data.date.toLocaleDateString()}`);
      
      doc.moveDown();
      doc.text('Customer Details:', { underline: true });
      doc.text(`Name: ${data.user.name}`)
        .text(`Email: ${data.user.email}`);
      
      if (data.user.phone) doc.text(`Phone: ${data.user.phone}`);
      if (data.user.address) doc.text(`Address: ${data.user.address}`);
      
      doc.moveDown();
      doc.text('Thank you for your payment!', { align: 'center' });

      doc.end();
    } catch (err) {
      reject(new AppError('PDF generation failed'));
    }
  });
};