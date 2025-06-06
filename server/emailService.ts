import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendBookingConfirmation(
  clientEmail: string,
  clientName: string,
  timeSlot: string,
  fromEmail: string
): Promise<boolean> {
  const subject = "Consultation Call Confirmed - Balanced Method Coaching";
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #2563eb; margin-bottom: 20px;">Your Consultation Call is Confirmed!</h2>
      
      <p>Hi ${clientName},</p>
      
      <p>Thank you for booking your free introductory consultation call with Mark from Balanced Method Coaching. Your appointment has been confirmed for:</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #1f2937;">${timeSlot}</p>
      </div>
      
      <p>During our call, we'll discuss:</p>
      <ul>
        <li>Your current nutrition goals and challenges</li>
        <li>How my coaching approach can help you achieve sustainable results</li>
        <li>The best next steps for your nutrition journey</li>
      </ul>
      
      <p>If you need to cancel or reschedule, please reply to this email as soon as possible.</p>
      
      <p>Looking forward to speaking with you!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>Mark</strong><br>
        Balanced Method Coaching<br>
        Certified Nutrition Coach
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This email was sent regarding your consultation booking. If you have any questions, please reply to this email.
      </p>
    </div>
  `;

  return await sendEmail({
    to: clientEmail,
    from: fromEmail,
    subject,
    html,
    text: `Hi ${clientName}, your consultation call with Mark from Balanced Method Coaching is confirmed for ${timeSlot}. Looking forward to speaking with you!`
  });
}

export async function sendCoachNotification(
  coachEmail: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  timeSlot: string,
  goals: string
): Promise<boolean> {
  const subject = `New Consultation Booking - ${clientName}`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #dc2626; margin-bottom: 20px;">New Consultation Booking</h2>
      
      <p>You have a new consultation booking:</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Phone:</strong> ${clientPhone}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
      </div>
      
      <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Client Goals:</strong></p>
        <p>${goals}</p>
      </div>
      
      <p>View full details and manage bookings in your <a href="/admin" style="color: #2563eb;">admin panel</a>.</p>
    </div>
  `;

  return await sendEmail({
    to: coachEmail,
    from: coachEmail, // From same email
    subject,
    html,
    text: `New consultation booking from ${clientName} (${clientEmail}) for ${timeSlot}. Goals: ${goals}`
  });
}