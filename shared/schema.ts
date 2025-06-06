import { pgTable, text, serial, integer, boolean, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  hasCourseAccess: boolean("has_course_access").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const consultationRequests = pgTable("consultation_requests", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  contactMethod: varchar("contact_method", { length: 20 }).notNull(),
  selectedTimeSlot: varchar("selected_time_slot", { length: 50 }).notNull(),
  goals: text("goals").notNull(),
  experience: text("experience"),
  eatingOut: varchar("eating_out", { length: 255 }),
  typicalDay: text("typical_day"),
  drinks: text("drinks"),
  emotionalEating: text("emotional_eating"),
  medications: text("medications"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, confirmed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coachingCalls = pgTable("coaching_calls", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  contactMethod: varchar("contact_method", { length: 20 }).notNull(),
  selectedTimeSlot: varchar("selected_time_slot", { length: 50 }).notNull(),
  duration: integer("duration").notNull(), // 30, 45, or 60 minutes
  amount: integer("amount").notNull(), // price in cents
  stripePaymentIntentId: varchar("stripe_payment_intent_id"),
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, paid, confirmed, completed, cancelled
  rolloverMinutes: integer("rollover_minutes").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Table to track booked appointments and prevent double-bookings
export const bookedSlots = pgTable("booked_slots", {
  id: serial("id").primaryKey(),
  timeSlot: varchar("time_slot", { length: 50 }).notNull().unique(),
  consultationRequestId: integer("consultation_request_id").references(() => consultationRequests.id),
  coachingCallId: integer("coaching_call_id").references(() => coachingCalls.id),
  bookedAt: timestamp("booked_at").defaultNow().notNull(),
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertConsultationRequestSchema = createInsertSchema(consultationRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertBookedSlotSchema = createInsertSchema(bookedSlots).omit({
  id: true,
  bookedAt: true,
});

export const insertCoachingCallSchema = createInsertSchema(coachingCalls).omit({
  id: true,
  createdAt: true,
  status: true,
  rolloverMinutes: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type BookedSlot = typeof bookedSlots.$inferSelect;
export type InsertBookedSlot = z.infer<typeof insertBookedSlotSchema>;
export type CoachingCall = typeof coachingCalls.$inferSelect;
export type InsertCoachingCall = z.infer<typeof insertCoachingCallSchema>;
