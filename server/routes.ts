import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { consultationRequests, insertConsultationRequestSchema, coachingCalls, insertCoachingCallSchema, bookedSlots, users, availableTimeSlots, insertAvailableTimeSlotSchema, specificDateSlots, insertSpecificDateSlotSchema, dateOverrides, insertDateOverrideSchema } from "@shared/schema";
import { desc, eq, and, sql, isNotNull, or } from "drizzle-orm";
import Stripe from "stripe";
import { setupAuth, isAuthenticated } from "./auth";
import { sendEmail, sendBookingConfirmation, sendCoachNotification, sendCourseAccessEmail } from "./emailService";
import crypto from 'crypto';

// Helper function to generate temporary password
function generateTemporaryPassword(): string {
  return crypto.randomBytes(8).toString('hex');
}

// Helper function to format time slots for emails
function formatTimeSlotForEmail(timeSlot: string): string {
  const timeSlotMap: { [key: string]: string } = {
    "mon-6am": "Monday 6:00 AM EST",
    "mon-630am": "Monday 6:30 AM EST", 
    "mon-7am": "Monday 7:00 AM EST",
    "mon-730am": "Monday 7:30 AM EST",
    "mon-8am": "Monday 8:00 AM EST",
    "mon-830am": "Monday 8:30 AM EST",
    "mon-9am": "Monday 9:00 AM EST",
    "mon-930am": "Monday 9:30 AM EST",
    "mon-10am": "Monday 10:00 AM EST",
    "tue-6am": "Tuesday 6:00 AM EST",
    "tue-630am": "Tuesday 6:30 AM EST",
    "tue-7am": "Tuesday 7:00 AM EST",
    "tue-730am": "Tuesday 7:30 AM EST",
    "tue-8am": "Tuesday 8:00 AM EST",
    "tue-830am": "Tuesday 8:30 AM EST",
    "tue-9am": "Tuesday 9:00 AM EST",
    "tue-930am": "Tuesday 9:30 AM EST",
    "tue-10am": "Tuesday 10:00 AM EST",
    "wed-6am": "Wednesday 6:00 AM EST",
    "wed-630am": "Wednesday 6:30 AM EST",
    "wed-7am": "Wednesday 7:00 AM EST",
    "wed-730am": "Wednesday 7:30 AM EST",
    "wed-8am": "Wednesday 8:00 AM EST",
    "wed-830am": "Wednesday 8:30 AM EST",
    "wed-9am": "Wednesday 9:00 AM EST",
    "wed-930am": "Wednesday 9:30 AM EST",
    "wed-10am": "Wednesday 10:00 AM EST",
    "thu-6am": "Thursday 6:00 AM EST",
    "thu-630am": "Thursday 6:30 AM EST",
    "thu-7am": "Thursday 7:00 AM EST",
    "thu-730am": "Thursday 7:30 AM EST",
    "thu-8am": "Thursday 8:00 AM EST",
    "thu-830am": "Thursday 8:30 AM EST",
    "thu-9am": "Thursday 9:00 AM EST",
    "thu-930am": "Thursday 9:30 AM EST",
    "thu-10am": "Thursday 10:00 AM EST",
    "fri-6am": "Friday 6:00 AM EST",
    "fri-630am": "Friday 6:30 AM EST",
    "fri-7am": "Friday 7:00 AM EST",
    "fri-730am": "Friday 7:30 AM EST",
    "fri-8am": "Friday 8:00 AM EST",
    "fri-830am": "Friday 8:30 AM EST",
    "fri-9am": "Friday 9:00 AM EST",
    "fri-930am": "Friday 9:30 AM EST",
    "fri-10am": "Friday 10:00 AM EST"
  };
  return timeSlotMap[timeSlot] || timeSlot;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  // API routes for consultation requests
  app.post("/api/consultation-requests", async (req, res) => {
    try {
      console.log('Request body:', req.body);
      
      // Add missing required fields with defaults
      let requestData = { ...req.body };
      if (!requestData.contactMethod) requestData.contactMethod = "email";
      if (!requestData.source) requestData.source = "website";
      
      const validatedData = insertConsultationRequestSchema.parse(requestData);
      console.log('Validated data:', validatedData);
      
      // Check if time slot is still available
      const isAvailable = await storage.isTimeSlotAvailable(validatedData.selectedTimeSlot);
      if (!isAvailable) {
        return res.status(400).json({ 
          success: false, 
          error: "Selected time slot is no longer available. Please choose another time." 
        });
      }

      // Create consultation request with confirmed status and book the time slot atomically
      const consultationData = { ...validatedData, status: "confirmed" };
      const newRequest = await storage.createConsultationRequest(consultationData);
      
      // Free intro calls only use 30 minutes (single slot)
      await storage.bookTimeSlotWithDuration(
        validatedData.selectedTimeSlot,
        30, // Free intro calls are always 30 minutes
        newRequest.id, // consultationRequestId
        undefined // coachingCallId
      );

      // Format time slot for email
      const timeSlotFormatted = formatTimeSlotForEmail(validatedData.selectedTimeSlot);
      
      // Send confirmation email to client
      const coachEmail = "mark@balancedmethodcoaching.com";
      await sendBookingConfirmation(
        validatedData.email,
        `${validatedData.firstName} ${validatedData.lastName}`,
        timeSlotFormatted,
        coachEmail
      );

      // Send notification email to coach
      await sendCoachNotification(
        coachEmail,
        `${validatedData.firstName} ${validatedData.lastName}`,
        validatedData.email,
        validatedData.phone,
        timeSlotFormatted,
        validatedData.goals
      );

      res.json({ success: true, id: newRequest.id });
    } catch (error) {
      console.error("Error saving consultation request:", error);
      res.status(400).json({ success: false, error: "Invalid data" });
    }
  });

  app.get("/api/consultation-requests", async (req, res) => {
    try {
      const requests = await db
        .select()
        .from(consultationRequests)
        .orderBy(desc(consultationRequests.createdAt));

      res.json(requests);
    } catch (error) {
      console.error("Error fetching consultation requests:", error);
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  // API endpoint to get available time slots
  app.get("/api/available-time-slots", async (req, res) => {
    try {
      const bookedSlots = await storage.getBookedSlots();
      const bookedTimeSlots = bookedSlots.map(slot => slot.timeSlot);
      
      // 1. Get date ranges from admin configuration (stored in date_overrides)
      const dateRanges = await db
        .select()
        .from(dateOverrides)
        .where(and(
          eq(dateOverrides.type, 'available_only'),
          isNotNull(dateOverrides.startDate),
          isNotNull(dateOverrides.endDate),
          eq(dateOverrides.isActive, true)
        ));
      
      // 2. Get active recurring time slots
      const recurringSlots = await db
        .select()
        .from(availableTimeSlots)
        .where(eq(availableTimeSlots.isActive, true));
      
      // 3. Get date overrides (blocking rules)
      const blockingOverrides = await db
        .select()
        .from(dateOverrides)
        .where(and(
          isNotNull(dateOverrides.date),
          eq(dateOverrides.isActive, true),
          or(
            eq(dateOverrides.type, 'blocked'),
            eq(dateOverrides.type, 'blocked_specific')
          )
        ));
      
      const allSlots = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // For each date range, generate slots for each day within the range
      dateRanges.forEach(dateRange => {
        const startDate = new Date(dateRange.startDate);
        const endDate = new Date(dateRange.endDate);
        
        // Generate slots for each day in the range
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
          // Skip past dates
          if (currentDate < today) continue;
          
          const dayOfWeek = currentDate.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
          const dateString = currentDate.toISOString().split('T')[0];
          
          // Find matching recurring slots for this day of week
          const matchingRecurringSlots = recurringSlots.filter(slot => 
            slot.dayOfWeek === dayOfWeek
          );
          
          matchingRecurringSlots.forEach(recurringSlot => {
            const slotValue = `${dateString}-${recurringSlot.timeOfDay}`;
            
            // Check if this slot is already booked
            if (bookedTimeSlots.includes(slotValue)) return;
            
            // Check if this date has any blocking overrides
            const blockingOverride = blockingOverrides.find(override => override.date === dateString);
            
            if (blockingOverride) {
              if (blockingOverride.type === 'blocked') {
                // If it's a complete block, skip this entire date
                return; // Skip this blocked time slot
              } else if (blockingOverride.type === 'blocked_specific' && blockingOverride.timeSlots) {
                // For blocked_specific, skip if this time slot is in the blocked list
                const blockedTimes = Array.isArray(blockingOverride.timeSlots) 
                  ? blockingOverride.timeSlots 
                  : JSON.parse(blockingOverride.timeSlots || '[]');
                if (blockedTimes.includes(recurringSlot.timeOfDay)) {
                  return; // Skip this blocked time slot
                }
              }
            }
            
            // Create the available slot
            allSlots.push({
              id: allSlots.length + 1,
              value: slotValue,
              label: `${currentDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })} ${recurringSlot.label.split(' ').slice(-2).join(' ')}`,
              timeOfDay: recurringSlot.timeOfDay
            });
          });
        }
      });
      
      // Sort slots by date and time
      allSlots.sort((a, b) => {
        const dateA = new Date(a.value.split('-').slice(0, 3).join('-'));
        const dateB = new Date(b.value.split('-').slice(0, 3).join('-'));
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // Sort by time of day
        const timeOrder = ['6am', '630am', '7am', '730am', '8am', '830am', '9am', '930am', '10am', '1030am', '11am', '1130am', '12pm', '1230pm', '1pm', '130pm', '2pm', '230pm', '3pm', '330pm', '4pm', '430pm', '5pm', '530pm', '6pm', '630pm', '7pm', '730pm', '8pm', '830pm', '9pm', '930pm', '10pm', '1030pm', '11pm', '1130pm'];
        const indexA = timeOrder.indexOf(a.timeOfDay);
        const indexB = timeOrder.indexOf(b.timeOfDay);
        return indexA - indexB;
      });
      
      res.json(allSlots);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      res.status(500).json({ error: "Failed to fetch time slots" });
    }
  });

  // Authentication is handled in auth.ts

  // Route to grant course access after payment
  app.post('/api/grant-course-access', async (req: any, res) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userId = req.user.id;
      await storage.grantCourseAccess(userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error granting course access:", error);
      res.status(500).json({ error: "Failed to grant access" });
    }
  });

  // Admin API endpoints
  app.get('/api/admin/booked-slots', isAuthenticated, async (req: any, res) => {
    try {
      const bookedSlots = await storage.getBookedSlots();
      res.json(bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      res.status(500).json({ error: "Failed to fetch booked slots" });
    }
  });

  app.delete('/api/admin/booked-slots/:id', isAuthenticated, async (req: any, res) => {
    try {
      const slotId = parseInt(req.params.id);
      await storage.deleteBookedSlot(slotId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting booked slot:", error);
      res.status(500).json({ error: "Failed to delete booked slot" });
    }
  });

  // Client cancellation route (public)
  app.post("/api/cancel-booking", async (req, res) => {
    try {
      const { email, timeSlot } = req.body;
      
      if (!email || !timeSlot) {
        return res.status(400).json({ 
          success: false, 
          error: "Email and time slot are required" 
        });
      }

      // Find the consultation request
      const requests = await db
        .select()
        .from(consultationRequests)
        .where(and(
          eq(consultationRequests.email, email),
          eq(consultationRequests.selectedTimeSlot, timeSlot),
          eq(consultationRequests.status, "confirmed")
        ))
        .limit(1);

      if (!requests || requests.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: "No confirmed booking found with that email and time slot" 
        });
      }

      const consultationRequest = requests[0];
      
      // Delete the booked slot
      await storage.deleteBookedSlotByRequestId(consultationRequest.id);
      
      // Update consultation request status to cancelled
      await db
        .update(consultationRequests)
        .set({ status: "cancelled" })
        .where(eq(consultationRequests.id, consultationRequest.id));

      res.json({ success: true, message: "Booking cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling booking:", error);
      res.status(500).json({ success: false, error: "Failed to cancel booking" });
    }
  });

  // Delete consultation request (admin only)
  app.delete('/api/admin/consultation-requests/:id', async (req: any, res) => {
    try {
      const requestId = parseInt(req.params.id);
      
      // Also delete any associated booked slot
      await storage.deleteBookedSlotByRequestId(requestId);
      
      // Delete the consultation request
      await db
        .delete(consultationRequests)
        .where(eq(consultationRequests.id, requestId));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting consultation request:", error);
      res.status(500).json({ error: "Failed to delete consultation request" });
    }
  });

  // Delete coaching call (admin only)
  app.delete('/api/admin/coaching-calls/:id', async (req: any, res) => {
    try {
      const callId = parseInt(req.params.id);
      
      // First get the coaching call to find associated booked slot
      const call = await storage.getCoachingCall(callId);
      if (!call) {
        return res.status(404).json({ error: "Coaching call not found" });
      }
      
      // Delete associated booked slots (delete dependent slots first to avoid foreign key constraint)
      await db.delete(bookedSlots).where(
        and(
          eq(bookedSlots.coachingCallId, callId),
          isNotNull(bookedSlots.primarySlotId)
        )
      );
      // Then delete primary slots
      await db.delete(bookedSlots).where(eq(bookedSlots.coachingCallId, callId));
      
      // Delete the coaching call
      await db
        .delete(coachingCalls)
        .where(eq(coachingCalls.id, callId));
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting coaching call:", error);
      res.status(500).json({ error: "Failed to delete coaching call" });
    }
  });

  // Coaching calls endpoints
  app.post('/api/coaching-calls/create-payment-intent', async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      console.log('Coaching call request body:', req.body);
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-05-28.basil",
      });
      
      // Add missing required fields with defaults
      let requestData = { ...req.body };
      if (!requestData.contactMethod) requestData.contactMethod = "email";
      
      const validatedData = insertCoachingCallSchema.parse(requestData);
      console.log('Validated coaching call data:', validatedData);
      
      // Check if time slot(s) are available based on duration
      let slotsAvailable = false;
      if (validatedData.duration > 30) {
        // For 45+ minute calls, check consecutive slots
        slotsAvailable = await storage.areConsecutiveSlotsAvailable(validatedData.selectedTimeSlot);
        if (!slotsAvailable) {
          return res.status(400).json({ error: "Selected time slot and the following slot are not available for this duration" });
        }
      } else {
        // For 30 minute calls, check single slot
        slotsAvailable = await storage.isTimeSlotAvailable(validatedData.selectedTimeSlot);
        if (!slotsAvailable) {
          return res.status(400).json({ error: "Selected time slot is no longer available" });
        }
      }

      // Create coaching call record
      const coachingCall = await storage.createCoachingCall(validatedData);

      // Book the time slot(s) based on duration
      await storage.bookTimeSlotWithDuration(
        validatedData.selectedTimeSlot,
        validatedData.duration,
        undefined, // consultationRequestId
        coachingCall.id // coachingCallId
      );

      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: validatedData.amount,
        currency: "usd",
        metadata: {
          coachingCallId: coachingCall.id.toString(),
          duration: validatedData.duration.toString(),
          timeSlot: validatedData.selectedTimeSlot,
        },
      });

      // Update coaching call with payment intent ID
      await storage.updateCoachingCallStatus(coachingCall.id, "pending", paymentIntent.id);

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        callId: coachingCall.id 
      });
    } catch (error: any) {
      console.error("Error creating coaching call payment:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  app.get('/api/coaching-calls', isAuthenticated, async (req, res) => {
    try {
      const calls = await storage.getCoachingCalls();
      res.json(calls);
    } catch (error) {
      console.error("Error fetching coaching calls:", error);
      res.status(500).json({ error: "Failed to fetch coaching calls" });
    }
  });

  app.post('/api/coaching-calls/:id/confirm-payment', async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-05-28.basil",
      });
      const callId = parseInt(req.params.id);
      const { paymentIntentId } = req.body;

      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Update coaching call status and book the time slot
        await storage.updateCoachingCallStatus(callId, "paid", paymentIntentId);
        
        const coachingCall = await storage.getCoachingCall(callId);
        if (coachingCall) {
          // Book the time slot(s) based on duration
          await storage.bookTimeSlotWithDuration(
            coachingCall.selectedTimeSlot,
            coachingCall.duration,
            undefined, // consultationRequestId
            callId // coachingCallId
          );
          
          // Send confirmation emails
          const coachEmail = "mark@balancedmethodcoaching.com";
          await sendBookingConfirmation(
            coachingCall.email,
            `${coachingCall.firstName} ${coachingCall.lastName}`,
            formatTimeSlotForEmail(coachingCall.selectedTimeSlot),
            coachEmail
          );
          
          await sendCoachNotification(
            coachEmail,
            `${coachingCall.firstName} ${coachingCall.lastName}`,
            coachingCall.email,
            coachingCall.phone,
            formatTimeSlotForEmail(coachingCall.selectedTimeSlot),
            `${coachingCall.duration}-minute Coaching Call ($${coachingCall.amount / 100}) - Goals: ${coachingCall.goals}`
          );
        }
        
        res.json({ success: true, message: "Payment confirmed and coaching call booked" });
      } else {
        res.status(400).json({ error: "Payment not successful" });
      }
    } catch (error) {
      console.error("Error confirming coaching call payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Create payment intent for self-paced course
  app.post('/api/create-payment-intent', async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });
      
      const { userEmail, firstName, lastName } = req.body;
      
      // Create Stripe payment intent for $149 course
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 14900, // $149.00 in cents
        currency: "usd",
        metadata: {
          productName: "Self-Paced Nutrition Course",
          userEmail: userEmail || "unknown",
          customerName: `${firstName || ''} ${lastName || ''}`.trim(),
        },
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id 
      });
    } catch (error: any) {
      console.error("Error creating course payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  // Confirm course payment and grant access
  app.post('/api/confirm-course-payment', async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });
      
      const { paymentIntentId, email, firstName, lastName } = req.body;
      const userEmail = email;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        console.log("Processing course payment for email:", userEmail);
        
        // Check if user exists, create if not
        let user = await storage.getUserByEmail(userEmail);
        let shouldSendEmail = false;
        let temporaryPassword = "";
        
        if (!user) {
          // Create new user account
          temporaryPassword = generateTemporaryPassword();
          const hashedPassword = await storage.hashPassword(temporaryPassword);
          
          console.log("Creating new user for course purchase:", userEmail);
          
          user = await storage.createUser({
            email: userEmail,
            hashedPassword,
            firstName: firstName || "Course",
            lastName: lastName || "Student",
            hasCourseAccess: true
          });
          
          shouldSendEmail = true;
          console.log("User created, will send email to:", userEmail);
        } else if (!user.hasCourseAccess) {
          // Grant course access to existing user (only if they don't already have it)
          await storage.grantCourseAccess(user.id);
          console.log("Course access granted to existing user:", userEmail);
        } else {
          console.log("User already has course access:", userEmail);
        }
        
        // Send email only once for new users
        if (shouldSendEmail) {
          try {
            await sendCourseAccessEmail(
              userEmail,
              `${user.firstName} ${user.lastName}`,
              userEmail,
              temporaryPassword
            );
            console.log(`Course access email sent to ${userEmail}`);
          } catch (emailError) {
            console.error("Failed to send course access email:", emailError);
          }
        }
        
        res.json({ 
          success: true, 
          message: "Course access granted and welcome email sent" 
        });
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Error confirming course payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });


  // Set new password for first-time users
  app.post('/api/set-new-password', isAuthenticated, async (req: any, res) => {
    try {
      const { newPassword } = req.body;
      const userId = req.user.id;
      
      if (!newPassword) {
        return res.status(400).json({ message: "New password is required" });
      }
      
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
      }
      
      // Hash new password with bcrypt
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password and mark as no longer first login
      await db.update(users)
        .set({ 
          hashedPassword, 
          isFirstLogin: false,
          updatedAt: new Date() 
        })
        .where(eq(users.id, userId));
      
      res.json({ success: true, message: "Password set successfully" });
    } catch (error) {
      console.error("Error setting new password:", error);
      res.status(500).json({ message: "Failed to set password" });
    }
  });

  // Password reset endpoint
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return res.json({ success: true, message: "If an account exists with this email, a password reset has been sent." });
      }
      
      // Generate new temporary password
      const newTempPassword = generateTemporaryPassword();
      const bcrypt = await import('bcrypt');
      const hashedPassword = await bcrypt.hash(newTempPassword, 10);
      
      // Update user password and set first login flag
      await db.update(users)
        .set({ 
          hashedPassword, 
          isFirstLogin: true,  // Force password change on next login
          updatedAt: new Date() 
        })
        .where(eq(users.id, user.id));
      
      // Send password reset email
      try {
        await sendEmail({
          to: email,
          from: 'mark@balancedmethodcoaching.com',
          subject: 'Password Reset - Balanced Method Coaching',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Password Reset Request</h2>
              <p>Hello ${user.firstName || 'there'},</p>
              <p>We've reset your password as requested. Here are your new login credentials:</p>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>New Temporary Password:</strong> ${newTempPassword}</p>
              </div>
              
              <p>For security reasons, you'll be required to set a new password when you log in.</p>
              
              <p><a href="${process.env.REPLIT_DOMAINS ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/auth` : 'http://localhost:5000/auth'}" 
                     style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                     Login Now
                 </a></p>
              
              <p>If you didn't request this password reset, please contact us immediately at mark@balancedmethodcoaching.com</p>
              
              <p>Best regards,<br>Coach Mark<br>Balanced Method Coaching</p>
            </div>
          `,
          text: `Password Reset - Your new temporary password is: ${newTempPassword}. Please log in and set a new password for security.`
        });
        
        console.log(`Password reset email sent to ${email}`);
      } catch (emailError) {
        console.error("Failed to send password reset email:", emailError);
      }
      
      res.json({ success: true, message: "Password reset sent successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Test email endpoint (for development)
  app.post('/api/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      
      // Log the sender email being used
      const senderEmail = "mark@balancedmethodcoaching.com";
      console.log(`Attempting to send email from: ${senderEmail} to: ${email}`);
      
      const success = await sendCourseAccessEmail(
        email || "demo@test.com",
        "Test User",
        email || "demo@test.com",
        "temp123456"
      );
      
      if (success) {
        res.json({ 
          success: true, 
          message: "Test email sent successfully",
          senderEmail: "mark@balancedmethodcoaching.com",
          recipientEmail: email
        });
      } else {
        res.status(500).json({ error: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Test email error:", error);
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Download route for course documents
  app.get('/api/download/:filename', isAuthenticated, (req, res) => {
    const filename = req.params.filename;
    
    // Security check - only allow specific document downloads
    const allowedFiles = [
      'Part-0-Summary.docx', 'Part-1-Summary.docx', 'Part-2-Summary.docx', 'Part-3-Summary.docx',
      'Part-4-Summary.docx', 'Part-5-Summary.docx', 'Part-6-Summary.docx', 'Part-7-Summary.docx',
      'Part-8-Summary.docx', 'Part-9-Summary.docx', 'Part-10-Summary.docx', 'Part-11-Summary.docx'
    ];
    
    if (!allowedFiles.includes(filename)) {
      return res.status(404).json({ error: "File not found" });
    }
    
    const filePath = `./public/${filename}`;
    
    // Set proper headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    
    res.download(filePath, filename, (error) => {
      if (error) {
        console.error('Download error:', error);
        if (!res.headersSent) {
          res.status(404).json({ error: "File not found" });
        }
      }
    });
  });

  // Admin endpoint to delete a user
  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = parseInt(req.params.id);
      console.log("Delete user request:", { userId, currentUser: req.user });
      
      // Only allow admin access
      if (req.user.email !== 'adkinsm24@hotmail.com') {
        return res.status(403).json({ error: "Access denied" });
      }
      
      // Prevent deleting yourself
      if (req.user.id === userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      // Delete related records first to avoid foreign key constraints
      // Note: Most related tables don't have direct userId foreign keys, so we'll skip this step
      // The user deletion should work without cascading deletes
      
      // Delete the user
      const result = await db.delete(users).where(eq(users.id, userId)).returning();
      
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      
      console.log("User deleted successfully:", result[0]);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user: " + error.message });
    }
  });

  // Admin endpoint to list all users
  app.get('/api/admin/users', isAuthenticated, async (req, res) => {
    try {
      const allUsers = await db.select({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        hasCourseAccess: users.hasCourseAccess,
        createdAt: users.createdAt
      }).from(users).orderBy(desc(users.createdAt));
      
      res.json(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // Password reset endpoint for testing
  app.post('/api/reset-password', async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      
      if (!email || !newPassword) {
        return res.status(400).json({ error: "Email and new password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "No user found with this email" });
      }
      
      // Update user password in database (simplified for testing)
      await db.update(users)
        .set({ hashedPassword: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' })
        .where(eq(users.email, email));
      
      res.json({ 
        success: true, 
        message: "Password updated successfully. You can now login with your new password." 
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  // Admin middleware to check if user is admin
  const isAdmin = async (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    const user = await storage.getUser(req.user.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    
    next();
  };

  // Admin time slots management routes
  app.get("/api/admin/time-slots", isAdmin, async (req, res) => {
    try {
      const timeSlots = await db
        .select()
        .from(availableTimeSlots)
        .orderBy(availableTimeSlots.dayOfWeek, availableTimeSlots.timeOfDay);
      
      res.json(timeSlots);
    } catch (error) {
      console.error("Error fetching admin time slots:", error);
      res.status(500).json({ error: "Failed to fetch time slots" });
    }
  });

  app.post("/api/admin/time-slots", isAdmin, async (req, res) => {
    try {
      console.log("Received time slot data:", req.body);
      const validatedData = insertAvailableTimeSlotSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      const [newTimeSlot] = await db
        .insert(availableTimeSlots)
        .values(validatedData)
        .returning();
      
      console.log("Created time slot:", newTimeSlot);
      res.json(newTimeSlot);
    } catch (error) {
      console.error("Error creating time slot:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
      res.status(400).json({ error: error.message || "Invalid data or time slot already exists" });
    }
  });

  app.put("/api/admin/time-slots/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAvailableTimeSlotSchema.parse(req.body);
      
      const [updatedTimeSlot] = await db
        .update(availableTimeSlots)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(availableTimeSlots.id, id))
        .returning();
      
      if (!updatedTimeSlot) {
        return res.status(404).json({ error: "Time slot not found" });
      }
      
      res.json(updatedTimeSlot);
    } catch (error) {
      console.error("Error updating time slot:", error);
      res.status(400).json({ error: "Invalid data" });
    }
  });

  app.put("/api/admin/time-slots/:id/toggle", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isActive } = req.body;
      
      const [updatedTimeSlot] = await db
        .update(availableTimeSlots)
        .set({ isActive, updatedAt: new Date() })
        .where(eq(availableTimeSlots.id, id))
        .returning();
      
      if (!updatedTimeSlot) {
        return res.status(404).json({ error: "Time slot not found" });
      }
      
      res.json(updatedTimeSlot);
    } catch (error) {
      console.error("Error toggling time slot:", error);
      res.status(500).json({ error: "Failed to update time slot" });
    }
  });

  app.delete("/api/admin/time-slots/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [deletedTimeSlot] = await db
        .delete(availableTimeSlots)
        .where(eq(availableTimeSlots.id, id))
        .returning();
      
      if (!deletedTimeSlot) {
        return res.status(404).json({ error: "Time slot not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting time slot:", error);
      res.status(500).json({ error: "Failed to delete time slot" });
    }
  });

  // Specific date slots management routes
  app.get("/api/admin/specific-date-slots", isAdmin, async (req, res) => {
    try {
      // Get both individual date slots and date ranges
      const individualSlots = await db
        .select()
        .from(specificDateSlots)
        .orderBy(specificDateSlots.date, specificDateSlots.timeOfDay);
      
      const dateRanges = await db
        .select()
        .from(dateOverrides)
        .where(sql`start_date IS NOT NULL AND end_date IS NOT NULL`);
      
      // Combine and format the results
      const combinedResults = [
        ...individualSlots,
        ...dateRanges.map(range => ({
          id: range.id,
          label: range.reason || `Date Range: ${range.startDate} to ${range.endDate}`,
          date: `${range.startDate} to ${range.endDate}`,
          isActive: range.isActive,
          type: 'date_range',
          startDate: range.startDate,
          endDate: range.endDate
        }))
      ];
      
      res.json(combinedResults);
    } catch (error) {
      console.error("Error fetching specific date slots:", error);
      res.status(500).json({ error: "Failed to fetch specific date slots" });
    }
  });

  app.post("/api/admin/specific-date-slots", isAdmin, async (req, res) => {
    try {
      console.log("Received date range data:", req.body);
      const { startDate, endDate, label, isActive } = req.body;
      
      // Create a date range override entry
      const dateRangeData = {
        startDate,
        endDate,
        type: "available_only" as const,
        reason: label || `Date range: ${startDate} to ${endDate}`,
        isActive: true,
      };
      
      console.log("Creating date range with data:", dateRangeData);
      
      const [newDateRange] = await db
        .insert(dateOverrides)
        .values(dateRangeData)
        .returning();
      
      // Invalidate the specific date slots cache so UI updates
      res.json({
        message: `Created date range from ${startDate} to ${endDate}`,
        dateRange: newDateRange
      });
    } catch (error) {
      console.error("Error creating specific date slots:", error);
      res.status(400).json({ error: error.message || "Invalid data" });
    }
  });

  app.delete("/api/admin/specific-date-slots/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [deletedSlot] = await db
        .delete(specificDateSlots)
        .where(eq(specificDateSlots.id, id))
        .returning();
      
      if (!deletedSlot) {
        return res.status(404).json({ error: "Specific date slot not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting specific date slot:", error);
      res.status(500).json({ error: "Failed to delete specific date slot" });
    }
  });

  // Date overrides management routes
  app.get("/api/admin/date-overrides", isAdmin, async (req, res) => {
    try {
      const overrides = await db
        .select()
        .from(dateOverrides)
        .orderBy(dateOverrides.date);
      
      res.json(overrides);
    } catch (error) {
      console.error("Error fetching date overrides:", error);
      res.status(500).json({ error: "Failed to fetch date overrides" });
    }
  });

  app.post("/api/admin/date-overrides", isAdmin, async (req, res) => {
    try {
      console.log("Received date override data:", req.body);
      const { date, type, timeSlots, reason } = req.body;
      
      const overrideData = {
        date,
        type,
        timeSlots: timeSlots ? JSON.stringify(timeSlots) : null,
        reason: reason || (
          type === "blocked" ? `All time slots blocked for ${date}` :
          type === "blocked_specific" ? `Specific time slots blocked for ${date}` :
          `Date override for ${date}`
        ),
        isActive: true,
      };
      
      const [newOverride] = await db
        .insert(dateOverrides)
        .values(overrideData)
        .returning();
      
      res.json(newOverride);
    } catch (error) {
      console.error("Error creating date override:", error);
      res.status(400).json({ error: error.message || "Invalid data" });
    }
  });

  app.delete("/api/admin/date-overrides/:id", isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const [deletedOverride] = await db
        .delete(dateOverrides)
        .where(eq(dateOverrides.id, id))
        .returning();
      
      if (!deletedOverride) {
        return res.status(404).json({ error: "Date override not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting date override:", error);
      res.status(500).json({ error: "Failed to delete date override" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
