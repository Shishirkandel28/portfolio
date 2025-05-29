import sgMail from '@sendgrid/mail';

// Initialize SendGrid if API key is available
let sendGridConfigured = false;
if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendGridConfigured = true;
    console.log("SendGrid API key configured successfully");
  } catch (error) {
    console.error("Failed to configure SendGrid:", error);
  }
} else {
  console.warn("SendGrid API key not properly configured - email functionality will be limited");
}

interface EmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    if (!sendGridConfigured) {
      console.error('SendGrid not configured. Email cannot be sent.');
      return false;
    }

    const mailData = {
      to: params.to,
      from: 'noreply@shishirkandel.com',
      subject: params.subject,
      ...(params.text && { text: params.text }),
      ...(params.html && { html: params.html }),
    };

    await sgMail.send(mailData);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendOTPEmail(email: string, otp: string): Promise<boolean> {
  const subject = "Password Reset OTP - Admin Portal";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">Password Reset Request</h2>
      <p>You have requested to reset your password for the admin portal.</p>
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin: 0; color: #1f2937;">Your OTP Code:</h3>
        <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px; margin-top: 10px;">
          ${otp}
        </div>
      </div>
      <p style="color: #6b7280;">
        This OTP is valid for 10 minutes. If you didn't request this reset, please ignore this email.
      </p>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 14px;">
          This is an automated message from your portfolio admin system.
        </p>
      </div>
    </div>
  `;

  const text = `
    Password Reset Request
    
    You have requested to reset your password for the admin portal.
    
    Your OTP Code: ${otp}
    
    This OTP is valid for 10 minutes. If you didn't request this reset, please ignore this email.
  `;

  return await sendEmail({
    to: email,
    subject,
    html,
    text
  });
}