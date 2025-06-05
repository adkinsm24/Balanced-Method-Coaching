import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { consultationRequests, insertConsultationRequestSchema } from "@shared/schema";
import { desc } from "drizzle-orm";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for consultation requests
  app.post("/api/consultation-requests", async (req, res) => {
    try {
      const validatedData = insertConsultationRequestSchema.parse(req.body);
      
      const [newRequest] = await db
        .insert(consultationRequests)
        .values(validatedData)
        .returning();

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

  const httpServer = createServer(app);

  return httpServer;
}
