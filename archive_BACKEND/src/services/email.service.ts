import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetCodeEmail(to: string, code: string): Promise<void> {
  const from = process.env.EMAIL_FROM || "noreply@archiveoutfitters.com";

  await transporter.sendMail({
    from: `"Archive Outfitters" <${from}>`,
    to,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0f0f0f;">Password Reset</h2>
        <p style="color: #555; font-size: 15px;">Use the code below to reset your password. It expires in 15 minutes.</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 1rem; text-align: center; margin: 1.5rem 0;">
          <span style="font-size: 2rem; font-weight: 700; letter-spacing: 0.3em; color: #0f0f0f;">${code}</span>
        </div>
        <p style="color: #888; font-size: 13px;">If you did not request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
}
