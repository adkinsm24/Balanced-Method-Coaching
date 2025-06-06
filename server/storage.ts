import {
  users,
  consultationRequests,
  bookedSlots,
  coachingCalls,
  type User,
  type UpsertUser,
  type InsertConsultationRequest,
  type ConsultationRequest,
  type BookedSlot,
  type InsertBookedSlot,
  type CoachingCall,
  type InsertCoachingCall,
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
  deleteBookedSlot(slotId: number): Promise<void>;
  deleteBookedSlotByRequestId(requestId: number): Promise<void>;
  
  // Coaching calls operations
  createCoachingCall(call: InsertCoachingCall): Promise<CoachingCall>;
  getCoachingCalls(): Promise<CoachingCall[]>;
  updateCoachingCallStatus(callId: number, status: string, paymentIntentId?: string): Promise<void>;
  getCoachingCall(callId: number): Promise<CoachingCall | undefined>;
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

  async deleteBookedSlot(slotId: number): Promise<void> {
    await db
      .delete(bookedSlots)
      .where(eq(bookedSlots.id, slotId));
  }

  async deleteBookedSlotByRequestId(requestId: number): Promise<void> {
    await db
      .delete(bookedSlots)
      .where(eq(bookedSlots.consultationRequestId, requestId));
  }

  // Coaching calls operations
  async createCoachingCall(call: InsertCoachingCall): Promise<CoachingCall> {
    const [newCall] = await db
      .insert(coachingCalls)
      .values(call)
      .returning();
    return newCall;
  }

  async getCoachingCalls(): Promise<CoachingCall[]> {
    return await db.select().from(coachingCalls);
  }

  async updateCoachingCallStatus(callId: number, status: string, paymentIntentId?: string): Promise<void> {
    const updateData: any = { status };
    if (paymentIntentId) {
      updateData.stripePaymentIntentId = paymentIntentId;
    }
    
    await db
      .update(coachingCalls)
      .set(updateData)
      .where(eq(coachingCalls.id, callId));
  }

  async getCoachingCall(callId: number): Promise<CoachingCall | undefined> {
    const [call] = await db.select().from(coachingCalls).where(eq(coachingCalls.id, callId));
    return call;
  }
}

export const storage = new DatabaseStorage();
