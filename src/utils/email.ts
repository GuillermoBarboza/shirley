// utils/email.ts

import nodemailer from 'nodemailer';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  try {
    // Create transporter (configure with your email service)
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Your App" <noreply@yourapp.com>',
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

export function generatePasswordResetEmail(username: string, resetLink: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Reset</h2>
      <p>Hello ${username},</p>
      <p>We received a request to reset your password. Click the link below to set a new password:</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      <p>Thanks,<br>Your App Team</p>
    </div>
  `;
}