import {
  users,
  consultationRequests,
  bookedSlots,
  type User,
  type UpsertUser,
  type InsertConsultationRequest,
  type ConsultationRequest,
  type BookedSlot,
  type InsertBookedSlot,
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  grantCourseAccess(userId: string): Promise<void>;
  
  // Booking operations
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getBookedSlots(): Promise<BookedSlot[]>;
  bookTimeSlot(slot: InsertBookedSlot): Promise<BookedSlot>;
  isTimeSlotAvailable(timeSlot: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async grantCourseAccess(userId: string): Promise<void> {
    await db
      .update(users)
      .set({ hasCourseAccess: true })
      .where(eq(users.id, userId));
  }

  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const [consultationRequest] = await db
      .insert(consultationRequests)
      .values(request)
      .returning();
    return consultationRequest;
  }

  async getBookedSlots(): Promise<BookedSlot[]> {
    return await db.select().from(bookedSlots);
  }

  async bookTimeSlot(slot: InsertBookedSlot): Promise<BookedSlot> {
    const [bookedSlot] = await db
      .insert(bookedSlots)
      .values(slot)
      .returning();
    return bookedSlot;
  }

  async isTimeSlotAvailable(timeSlot: string): Promise<boolean> {
    const [existingSlot] = await db
      .select()
      .from(bookedSlots)
      .where(eq(bookedSlots.timeSlot, timeSlot));
    return !existingSlot;
  }
}

export const storage = new DatabaseStorage();
