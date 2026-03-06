import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendInquiryNotification({ listing, inquiry }) {
  const to = listing.email || process.env.SMTP_USER;
  if (!to) return;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@getapro.org',
    to,
    subject: `New Inquiry for ${listing.business_name} on GetAPro.org`,
    html: `
      <h2>New Lead from GetAPro.org</h2>
      <p>You have a new inquiry for <strong>${listing.business_name}</strong>.</p>
      <table style="border-collapse:collapse;margin:16px 0;">
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Name</td><td>${inquiry.consumer_name}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Email</td><td>${inquiry.consumer_email}</td></tr>
        ${inquiry.consumer_phone ? `<tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Phone</td><td>${inquiry.consumer_phone}</td></tr>` : ''}
        <tr><td style="padding:4px 12px 4px 0;font-weight:bold;">Message</td><td>${inquiry.message}</td></tr>
      </table>
      <p style="color:#678289;font-size:13px;">This lead was generated via <a href="https://getapro.org">GetAPro.org</a></p>
    `,
  });
}

export async function sendClaimVerificationEmail({ email, businessName, verifyUrl }) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'noreply@getapro.org',
    to: email,
    subject: `Verify your claim for ${businessName} on GetAPro.org`,
    html: `
      <h2>Verify Your Business Claim</h2>
      <p>You requested to claim <strong>${businessName}</strong> on GetAPro.org.</p>
      <p>Click the button below to verify your email and complete the claim:</p>
      <p style="margin:24px 0;">
        <a href="${verifyUrl}" style="background:#FA7818;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;font-weight:bold;">
          Verify &amp; Claim Listing
        </a>
      </p>
      <p style="color:#678289;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
      <p style="color:#678289;font-size:13px;">Link: ${verifyUrl}</p>
    `,
  });
}
