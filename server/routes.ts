import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { consultationRequests, insertConsultationRequestSchema, coachingCalls, insertCoachingCallSchema, bookedSlots } from "@shared/schema";
import { desc, eq, and } from "drizzle-orm";
import Stripe from "stripe";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { sendBookingConfirmation, sendCoachNotification } from "./emailService";

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
      
      // Define all possible time slots
      const allTimeSlots = [
        // Monday
        { value: "mon-6am", label: "Monday 6:00 AM EST" },
        { value: "mon-630am", label: "Monday 6:30 AM EST" },
        { value: "mon-730am", label: "Monday 7:30 AM EST" },
        { value: "mon-8am", label: "Monday 8:00 AM EST" },
        { value: "mon-830am", label: "Monday 8:30 AM EST" },
        { value: "mon-930am", label: "Monday 9:30 AM EST" },
        { value: "mon-10am", label: "Monday 10:00 AM EST" },
        { value: "mon-1030am", label: "Monday 10:30 AM EST" },
        { value: "mon-11am", label: "Monday 11:00 AM EST" },
        { value: "mon-1130am", label: "Monday 11:30 AM EST" },
        { value: "mon-12pm", label: "Monday 12:00 PM EST" },
        
        // Tuesday
        { value: "tue-6am", label: "Tuesday 6:00 AM EST" },
        { value: "tue-630am", label: "Tuesday 6:30 AM EST" },
        { value: "tue-7am", label: "Tuesday 7:00 AM EST" },
        { value: "tue-730am", label: "Tuesday 7:30 AM EST" },
        { value: "tue-8am", label: "Tuesday 8:00 AM EST" },
        { value: "tue-830am", label: "Tuesday 8:30 AM EST" },
        { value: "tue-9am", label: "Tuesday 9:00 AM EST" },
        { value: "tue-930am", label: "Tuesday 9:30 AM EST" },
        { value: "tue-1030am", label: "Tuesday 10:30 AM EST" },
        { value: "tue-11am", label: "Tuesday 11:00 AM EST" },
        { value: "tue-1130am", label: "Tuesday 11:30 AM EST" },
        { value: "tue-12pm", label: "Tuesday 12:00 PM EST" },
        
        // Wednesday
        { value: "wed-6am", label: "Wednesday 6:00 AM EST" },
        { value: "wed-630am", label: "Wednesday 6:30 AM EST" },
        { value: "wed-7am", label: "Wednesday 7:00 AM EST" },
        { value: "wed-730am", label: "Wednesday 7:30 AM EST" },
        { value: "wed-830am", label: "Wednesday 8:30 AM EST" },
        { value: "wed-9am", label: "Wednesday 9:00 AM EST" },
        { value: "wed-930am", label: "Wednesday 9:30 AM EST" },
        { value: "wed-1030am", label: "Wednesday 10:30 AM EST" },
        { value: "wed-1130am", label: "Wednesday 11:30 AM EST" },
        
        // Thursday
        { value: "thu-6am", label: "Thursday 6:00 AM EST" },
        { value: "thu-630am", label: "Thursday 6:30 AM EST" },
        { value: "thu-7am", label: "Thursday 7:00 AM EST" },
        { value: "thu-8am", label: "Thursday 8:00 AM EST" },
        { value: "thu-830am", label: "Thursday 8:30 AM EST" },
        { value: "thu-930am", label: "Thursday 9:30 AM EST" },
        { value: "thu-10am", label: "Thursday 10:00 AM EST" },
        { value: "thu-11am", label: "Thursday 11:00 AM EST" },
        { value: "thu-1130am", label: "Thursday 11:30 AM EST" },
        { value: "thu-12pm", label: "Thursday 12:00 PM EST" },
        
        // Friday
        { value: "fri-6am", label: "Friday 6:00 AM EST" },
        { value: "fri-630am", label: "Friday 6:30 AM EST" },
        { value: "fri-7am", label: "Friday 7:00 AM EST" },
        { value: "fri-730am", label: "Friday 7:30 AM EST" },
        { value: "fri-8am", label: "Friday 8:00 AM EST" },
        { value: "fri-830am", label: "Friday 8:30 AM EST" },
        { value: "fri-1030am", label: "Friday 10:30 AM EST" },
        { value: "fri-11am", label: "Friday 11:00 AM EST" },
        { value: "fri-1130am", label: "Friday 11:30 AM EST" },
        { value: "fri-12pm", label: "Friday 12:00 PM EST" },
      ];
      
      // Filter out booked slots
      const availableSlots = allTimeSlots.filter(slot => !bookedTimeSlots.includes(slot.value));
      
      res.json(availableSlots);
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      res.status(500).json({ error: "Failed to fetch available slots" });
    }
  });

  // Stripe payment route for course purchase
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2023-10-16",
      });
      
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: {
          product: "Self-Paced Nutrition Course"
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Stripe error:", error);
      res.status(500).json({ error: "Payment setup failed" });
    }
  });

  // Authentication routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Route to grant course access after payment
  app.post('/api/grant-course-access', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
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
      const [request] = await db
        .select()
        .from(consultationRequests)
        .where(and(
          eq(consultationRequests.email, email),
          eq(consultationRequests.selectedTimeSlot, timeSlot),
          eq(consultationRequests.status, "confirmed")
        ))
        .limit(1);

      if (!request) {
        return res.status(404).json({ 
          success: false, 
          error: "No confirmed booking found with that email and time slot" 
        });
      }

      const consultationRequest = request[0];
      
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

  // Coaching calls endpoints
  app.post('/api/coaching-calls/create-payment-intent', async (req, res) => {
    try {
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
    try {
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
          
          // Send confirmation emails (you may want to create specific templates for coaching calls)
          await sendBookingConfirmation({
            to: coachingCall.email,
            firstName: coachingCall.firstName,
            timeSlot: formatTimeSlotForEmail(coachingCall.selectedTimeSlot),
            bookingType: `${coachingCall.duration}-minute Coaching Call`,
          });
          
          await sendCoachNotification({
            firstName: coachingCall.firstName,
            lastName: coachingCall.lastName,
            email: coachingCall.email,
            phone: coachingCall.phone,
            timeSlot: formatTimeSlotForEmail(coachingCall.selectedTimeSlot),
            bookingType: `${coachingCall.duration}-minute Coaching Call ($${coachingCall.amount / 100})`,
          });
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

  const httpServer = createServer(app);

  return httpServer;
}
