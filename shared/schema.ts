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

// User storage table for custom authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").unique().notNull(),
  hashedPassword: varchar("hashed_password").notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  hasCourseAccess: boolean("has_course_access").default(false),
  isAdmin: boolean("is_admin").default(false),
  stripeCustomerId: varchar("stripe_customer_id"),
  isFirstLogin: boolean("is_first_login").default(true),
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
  goals: text("goals").notNull(),
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
  duration: integer("duration").default(30).notNull(), // Duration in minutes
  isSecondarySlot: boolean("is_secondary_slot").default(false).notNull(), // True for the second slot of 45/60min bookings
  primarySlotId: integer("primary_slot_id").references(() => bookedSlots.id), // Reference to primary slot for secondary slots
  consultationRequestId: integer("consultation_request_id").references(() => consultationRequests.id),
  coachingCallId: integer("coaching_call_id").references(() => coachingCalls.id),
  bookedAt: timestamp("booked_at").defaultNow().notNull(),
});

export const availableTimeSlots = pgTable("available_time_slots", {
  id: serial("id").primaryKey(),
  value: varchar("value", { length: 50 }).notNull().unique(),
  label: varchar("label", { length: 100 }).notNull(),
  dayOfWeek: varchar("day_of_week", { length: 10 }).notNull(),
  timeOfDay: varchar("time_of_day", { length: 10 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const specificDateSlots = pgTable("specific_date_slots", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 20 }).notNull(), // YYYY-MM-DD format
  timeOfDay: varchar("time_of_day", { length: 10 }).notNull(),
  value: varchar("value", { length: 50 }).notNull().unique(), // date-time format like "2024-01-15-6am"
  label: varchar("label", { length: 100 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dateOverrides = pgTable("date_overrides", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 20 }), // YYYY-MM-DD format for single dates
  startDate: varchar("start_date", { length: 20 }), // YYYY-MM-DD format for date ranges
  endDate: varchar("end_date", { length: 20 }), // YYYY-MM-DD format for date ranges
  type: varchar("type", { length: 30 }).notNull(), // "blocked", "blocked_specific", or "available_only"
  timeSlots: text("time_slots"), // JSON array of specific time slots to block
  reason: varchar("reason", { length: 255 }), // optional reason for the override
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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

export const insertAvailableTimeSlotSchema = createInsertSchema(availableTimeSlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSpecificDateSlotSchema = createInsertSchema(specificDateSlots).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const dateRangeSlotSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  dayOfWeek: z.string().min(1, "Day is required"),
  timeOfDay: z.string().min(1, "Time is required"),
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
  isActive: z.boolean().optional().default(true),
});

export const insertDateOverrideSchema = createInsertSchema(dateOverrides).omit({
  id: true,
  createdAt: true,
});

export const dateRangeSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  type: z.enum(["blocked", "available_only"]).default("available_only"),
  reason: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type RegisterUser = z.infer<typeof registerUserSchema>;
export type LoginUser = z.infer<typeof loginUserSchema>;
export type InsertConsultationRequest = z.infer<typeof insertConsultationRequestSchema>;
export type ConsultationRequest = typeof consultationRequests.$inferSelect;
export type BookedSlot = typeof bookedSlots.$inferSelect;
export type InsertBookedSlot = z.infer<typeof insertBookedSlotSchema>;
export type CoachingCall = typeof coachingCalls.$inferSelect;
export type InsertCoachingCall = z.infer<typeof insertCoachingCallSchema>;
export type AvailableTimeSlot = typeof availableTimeSlots.$inferSelect;
export type InsertAvailableTimeSlot = z.infer<typeof insertAvailableTimeSlotSchema>;
export type SpecificDateSlot = typeof specificDateSlots.$inferSelect;
export type InsertSpecificDateSlot = z.infer<typeof insertSpecificDateSlotSchema>;
export type DateOverride = typeof dateOverrides.$inferSelect;
export type InsertDateOverride = z.infer<typeof insertDateOverrideSchema>;
