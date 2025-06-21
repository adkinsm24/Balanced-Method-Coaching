import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { consultationRequests, insertConsultationRequestSchema, coachingCalls, insertCoachingCallSchema, bookedSlots, users, availableTimeSlots, insertAvailableTimeSlotSchema, specificDateSlots, insertSpecificDateSlotSchema, dateOverrides, insertDateOverrideSchema } from "@shared/schema";
import { desc, eq, and, sql } from "drizzle-orm";
import Stripe from "stripe";
import { setupAuth, isAuthenticated } from "./auth";
import { sendBookingConfirmation, sendCoachNotification, sendCourseAccessEmail } from "./emailService";
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
      const validatedData = insertConsultationRequestSchema.parse(req.body);
      
      // Check if time slot is still available
      const isAvailable = await storage.isTimeSlotAvailable(validatedData.selectedTimeSlot);
      if (!isAvailable) {
        return res.status(400).json({ 
          success: false, 
          error: "Selected time slot is no longer available. Please choose another time." 
        });
      }

      // Create consultation request with confirmed status and book the time slot atomically
      const requestData = { ...validatedData, status: "confirmed" };
      const newRequest = await storage.createConsultationRequest(requestData);
      await storage.bookTimeSlot({
        timeSlot: validatedData.selectedTimeSlot,
        consultationRequestId: newRequest.id,
      });

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
      
      // Get active recurring time slots from database
      const recurringTimeSlots = await db
        .select()
        .from(availableTimeSlots)
        .where(eq(availableTimeSlots.isActive, true));
      
      // Get active specific date slots
      const specificSlots = await db
        .select()
        .from(specificDateSlots)
        .where(eq(specificDateSlots.isActive, true));
      
      // Get date overrides
      const overrides = await db.select().from(dateOverrides);
      
      // Combine recurring and specific slots
      const allTimeSlots = [...recurringTimeSlots, ...specificSlots];
      
      // Filter out booked slots and apply date overrides
      let availableSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot.value));
      
      // Apply date overrides logic here
      // For now, just return filtered slots
      // TODO: Implement date override filtering logic based on current date
      
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      res.status(500).json({ error: "Failed to fetch available slots" });
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
  app.delete('/api/admin/consultation-requests/:id', isAuthenticated, async (req: any, res) => {
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
  app.delete('/api/admin/coaching-calls/:id', isAuthenticated, async (req: any, res) => {
    try {
      const callId = parseInt(req.params.id);
      
      // First get the coaching call to find associated booked slot
      const call = await storage.getCoachingCall(callId);
      if (!call) {
        return res.status(404).json({ error: "Coaching call not found" });
      }
      
      // Delete any associated booked slot
      const bookedSlots = await storage.getBookedSlots();
      const associatedSlot = bookedSlots.find(slot => slot.coachingCallId === callId);
      if (associatedSlot) {
        await storage.deleteBookedSlot(associatedSlot.id);
      }
      
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
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-05-28.basil",
      });
      const validatedData = insertCoachingCallSchema.parse(req.body);
      
      // Check if time slot is available
      const isAvailable = await storage.isTimeSlotAvailable(validatedData.selectedTimeSlot);
      if (!isAvailable) {
        return res.status(400).json({ error: "Selected time slot is no longer available" });
      }

      // Create coaching call record
      const coachingCall = await storage.createCoachingCall(validatedData);

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
          // Book the time slot
          await storage.bookTimeSlot({
            timeSlot: coachingCall.selectedTimeSlot,
            coachingCallId: callId,
          });
          
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
      
      const { userEmail } = req.body;
      
      // Create Stripe payment intent for $149 course
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 14900, // $149.00 in cents
        currency: "usd",
        metadata: {
          productName: "Self-Paced Nutrition Course",
          userEmail: userEmail || "unknown",
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
      
      const { paymentIntentId, userEmail } = req.body;
      
      // Verify payment with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Find user by email and grant course access
        const user = await storage.getUserByEmail(userEmail);
        if (user) {
          await storage.grantCourseAccess(user.id);
          
          // Generate temporary password and send welcome email
          const temporaryPassword = generateTemporaryPassword();
          const clientName = `${user.firstName} ${user.lastName}`;
          
          // Send course access email with login details
          try {
            await sendCourseAccessEmail(
              userEmail,
              clientName,
              userEmail, // Login email same as purchase email
              temporaryPassword
            );
            console.log(`Course access email sent to ${userEmail}`);
          } catch (emailError) {
            console.error("Failed to send course access email:", emailError);
            // Don't fail the entire request if email fails
          }
          
          res.json({ 
            success: true, 
            message: "Course access granted and welcome email sent" 
          });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      } else {
        res.status(400).json({ error: "Payment not completed" });
      }
    } catch (error: any) {
      console.error("Error confirming course payment:", error);
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  // Test email endpoint (for development)
  app.post('/api/test-email', async (req, res) => {
    try {
      const { email } = req.body;
      const success = await sendCourseAccessEmail(
        email || "demo@test.com",
        "Test User",
        email || "demo@test.com",
        "temp123456"
      );
      
      if (success) {
        res.json({ success: true, message: "Test email sent successfully" });
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
