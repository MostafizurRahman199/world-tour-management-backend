




// src/app/utils/nodemailer.ts
import nodemailer, { Transporter } from "nodemailer";
import ejs from "ejs";
import path from "path";
import { ENV } from "../config/env";

type SendEmailOptions = {
  to: string;
  subject?: string;
  template?: string;           // template file name without extension, e.g. 'forgetPassword'
  templateData?: Record<string, any>;
  html?: string;               // if template not used, you can pass html directly
  text?: string;               // optional fallback text
  from?: string;
  attachments?: any[];         // nodemailer attachments array
};

let transporter: Transporter | null = null;

const createTransporter = (): Transporter => {
  if (transporter) return transporter;

  if (ENV.SMTP_HOST && ENV.SMTP_PORT) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST,
      port: Number(ENV.SMTP_PORT),
      secure: Number(ENV.SMTP_PORT) === 465, // true for 465, false for 587
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  } else if (ENV.SMTP_SERVICE) {
    // e.g. SMTP_SERVICE="gmail" or "SendGrid"
    transporter = nodemailer.createTransport({
      service: ENV.SMTP_SERVICE,
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  } else {
    // default to gmail service if nothing provided (works if SMTP_USER/PASS are set)
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  }

  return transporter;
};

/**
 * Render EJS template file (from src/app/views/emails)
 */



const renderTemplate = async (templateName: string, data: Record<string, any>) => {
  const templatePath = path.resolve(
    __dirname,        // current file location (app/config)
    "..",             // go up to app/
    "templates",      // folder
    "email",          // subfolder
    `${templateName}.ejs` // template file
  );
  
  return ejs.renderFile(templatePath, data, { async: true });
};




export const verifyTransporter = async () => {
  try {
    createTransporter();
    await transporter!.verify();
    console.log("✅ SMTP transporter verified");
  } catch (err) {
    console.error("❌ SMTP transporter verification failed:", err);
  }
};




export const sendEmail = async (opts: SendEmailOptions) => {
  
    const t = createTransporter();

  // build html either by template or direct html
  let html = opts.html;
  if (opts.template) {
    try {
      html = await renderTemplate(opts.template, opts.templateData || {});
    } catch (err) {
      console.error("Error rendering email template:", err);
      throw new Error("Failed to render email template");
    }
  }

  // if no html and no text, create a minimal text fallback
  const textFallback = opts.text ?? (html ? html.replace(/<[^>]+>/g, "") : "");

  const mailOptions = {
    from: opts.from ?? `<${ENV.SMTP_USER}>`,
    to: opts.to,
    subject: opts.subject ?? "No subject",
    html,
    text: textFallback,
    attachments: opts.attachments,
  };

  try {
    const info = await t.sendMail(mailOptions);
    // dev: log preview URL for Ethereal
    if (process.env.NODE_ENV !== "production" && (nodemailer as any).getTestMessageUrl) {
      console.log("Preview URL:", (nodemailer as any).getTestMessageUrl(info));
    }
    return info;
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Failed to send email");
  }
};
