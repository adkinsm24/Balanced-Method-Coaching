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
    const emailData: any = {
      to: params.to,
      from: {
        email: params.from,
        name: 'Balanced Method Coaching'
      },
      reply_to: {
        email: params.from,
        name: 'Mark Adkins'
      },
      subject: params.subject,
      // Add custom headers to improve deliverability
      custom_args: {
        'sender_type': 'transactional',
        'category': 'password_reset'
      },
      // Add tracking settings
      tracking_settings: {
        click_tracking: {
          enable: false
        },
        open_tracking: {
          enable: false
        }
      }
    };

    // Add content based on what's provided
    if (params.html) {
      emailData.html = params.html;
    }
    if (params.text) {
      emailData.text = params.text;
    }
    
    // Ensure we have at least one content type
    if (!params.html && !params.text) {
      emailData.text = "This email was sent from Balanced Method Coaching.";
    }

    const response = await mailService.send(emailData);
    console.log(`Email sent successfully to ${params.to}`);
    console.log('SendGrid response status:', response[0].statusCode);
    
    // Log message ID for tracking
    if (response[0].headers && response[0].headers['x-message-id']) {
      console.log('Message ID:', response[0].headers['x-message-id']);
    }
    
    return true;
  } catch (error: any) {
    console.error('SendGrid email error:', error);
    if (error.response && error.response.body) {
      console.error('SendGrid error details:', JSON.stringify(error.response.body, null, 2));
    }
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
    from: "mark@balancedmethodcoaching.com",
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
    from: "mark@balancedmethodcoaching.com",
    subject,
    html,
    text: `New consultation booking from ${clientName} (${clientEmail}) for ${timeSlot}. Goals: ${goals}`
  });
}

export async function sendCoachingCallConfirmation(
  clientEmail: string,
  clientName: string,
  timeSlot: string,
  duration: number,
  amount: number,
  contactMethod: string,
  fromEmail: string
): Promise<boolean> {
  const subject = "Coaching Call Confirmed - Balanced Method Coaching";
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #2563eb; margin-bottom: 20px;">Your Coaching Call is Confirmed!</h2>
      
      <p>Hi ${clientName},</p>
      
      <p>Thank you for booking your coaching session with Mark from Balanced Method Coaching. Your payment has been processed and your appointment is confirmed for:</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #1f2937;">${timeSlot}</p>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Duration: ${duration} minutes</p>
        <p style="margin: 5px 0 0 0; color: #6b7280;">Contact Method: ${contactMethod === 'facetime' ? 'FaceTime' : 'WhatsApp'}</p>
      </div>
      
      <div style="background: #dcfdf7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0; font-weight: bold; color: #047857;">Session Total: $${(amount / 100).toFixed(2)}</p>
        <p style="margin: 5px 0 0 0; color: #065f46; font-size: 14px;">Payment successfully processed</p>
      </div>
      
      <h3 style="color: #1f2937; margin-top: 30px;">What to expect during your coaching session:</h3>
      <ul>
        <li>Personalized nutrition guidance based on your specific goals</li>
        <li>Action steps you can implement immediately</li>
        <li>Answers to your nutrition questions</li>
        <li>Strategies for sustainable lifestyle changes</li>
      </ul>
      
      <h3 style="color: #1f2937;">Before our call:</h3>
      <ul>
        <li>Have a pen and paper ready to take notes</li>
        <li>Prepare any specific questions you'd like to discuss</li>
        <li>Find a quiet space for our conversation</li>
      </ul>
      
      <p><strong>Need to reschedule?</strong> Please contact me at least 24 hours in advance if possible.</p>
      
      <p>I'm looking forward to working with you and helping you achieve your nutrition goals!</p>
      
      <p style="margin-top: 30px;">
        Best regards,<br>
        <strong>Mark</strong><br>
        Balanced Method Coaching<br>
        Certified Nutrition Coach
      </p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        This email confirms your paid coaching session. If you have any questions, please reply to this email.
      </p>
    </div>
  `;

  return await sendEmail({
    to: clientEmail,
    from: "mark@balancedmethodcoaching.com",
    subject,
    html,
    text: `Hi ${clientName}, your ${duration}-minute coaching session with Mark from Balanced Method Coaching is confirmed for ${timeSlot}. Payment of $${(amount / 100).toFixed(2)} has been processed. Looking forward to working with you!`
  });
}

export async function sendCoachingCallNotification(
  coachEmail: string,
  clientName: string,
  clientEmail: string,
  clientPhone: string,
  timeSlot: string,
  duration: number,
  amount: number,
  goals: string,
  contactMethod: string
): Promise<boolean> {

  const subject = `New Coaching Call Booking - ${clientName} ($${(amount / 100).toFixed(2)})`;
  
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #dc2626; margin-bottom: 20px;">New Coaching Call Booking</h2>
      
      <p>You have a new paid coaching session booking:</p>
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Client:</strong> ${clientName}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Phone:</strong> ${clientPhone}</p>
        <p><strong>Time Slot:</strong> ${timeSlot}</p>
        <p><strong>Duration:</strong> ${duration} minutes</p>
        <p><strong>Contact Method:</strong> ${contactMethod === 'facetime' ? 'FaceTime' : 'WhatsApp'}</p>
      </div>
      
      <div style="background: #dcfdf7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
        <p style="margin: 0;"><strong>Revenue:</strong> $${(amount / 100).toFixed(2)}</p>
        <p style="margin: 5px 0 0 0; color: #065f46; font-size: 14px;">Payment successfully processed via Stripe</p>
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
    from: "mark@balancedmethodcoaching.com",
    subject,
    html,
    text: `New coaching session booking from ${clientName} (${clientEmail}) for ${timeSlot}. ${duration} minutes, $${(amount / 100).toFixed(2)} paid. Contact: ${contactMethod}. Goals: ${goals}`
  });
}

export async function sendCourseAccessEmail(
  clientEmail: string,
  clientName: string,
  loginEmail: string,
  temporaryPassword: string
): Promise<boolean> {
  const subject = "Your Nutrition Course Access - Login Information Inside";
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2563eb;">Welcome to Your Self-Paced Nutrition Course!</h2>
      
      <p>Dear ${clientName},</p>
      
      <p>Thank you for your purchase! Your payment has been successfully processed and you now have access to the complete Self-Paced Nutrition Course.</p>
      
      <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
        <h3 style="color: #1e40af; margin-top: 0;">Your Login Information:</h3>
        <p><strong>Email:</strong> ${loginEmail}</p>
        <p><strong>Temporary Password:</strong> <code style="background-color: #e5e7eb; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</code></p>
        <p><strong>Course URL:</strong> <a href="${process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5000'}/course" style="color: #2563eb;">Access Your Course</a></p>
      </div>
      
      <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #92400e;"><strong>Important:</strong> Please change your password after your first login for security.</p>
      </div>
      
      <h3 style="color: #1e40af;">What's Included in Your Course:</h3>
      <ul style="line-height: 1.6;">
        <li>11 comprehensive modules covering all aspects of nutrition and weight management</li>
        <li>Downloadable guides and worksheets for each section</li>
        <li>Practical strategies for sustainable lifestyle changes</li>
        <li>Access to Coach Mark's proven methods</li>
        <li>Lifetime access to all course materials</li>
      </ul>
      
      <p>You can log in anytime to access your course materials, track your progress, and download the included resources.</p>
      
      <p>If you have any questions or need assistance, please don't hesitate to reach out to us.</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>Best regards,<br>Coach Mark<br>Balanced Method Coaching</p>
        <p>Email: mark@balancedmethodcoaching.com</p>
      </div>
    </div>
  `;
  
  const textVersion = `
Welcome to Your Self-Paced Nutrition Course!

Dear ${clientName},

Thank you for your purchase! Your payment has been successfully processed and you now have access to the complete Self-Paced Nutrition Course.

Your Login Information:
Email: ${loginEmail}
Temporary Password: ${temporaryPassword}
Course URL: ${process.env.NODE_ENV === 'production' ? 'https://your-domain.com' : 'http://localhost:5000'}/course

What's Included in Your Course:
- 11 comprehensive modules covering all aspects of nutrition and weight management
- Downloadable guides and worksheets for each section  
- Practical strategies for sustainable lifestyle changes
- Access to Coach Mark's proven methods
- Lifetime access to all course materials

You can log in anytime to access your course materials, track your progress, and download the included resources.

If you have any questions or need assistance, please don't hesitate to reach out to us.

Best regards,
Coach Mark
Balanced Method Coaching
Email: mark@balancedmethodcoaching.com
  `;

  return await sendEmail({
    to: clientEmail,
    from: "mark@balancedmethodcoaching.com", // Using verified sender
    subject,
    html,
    text: textVersion,
  });
}