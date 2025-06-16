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

// Memory-based storage implementation as fallback
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private consultations: Map<number, ConsultationRequest> = new Map();
  private slots: Map<number, BookedSlot> = new Map();
  private calls: Map<number, CoachingCall> = new Map();
  private nextId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      hasCourseAccess: false,
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async grantCourseAccess(userId: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.hasCourseAccess = true;
      this.users.set(userId, user);
    }
  }

  async createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest> {
    const consultation: ConsultationRequest = {
      id: this.nextId++,
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      contactMethod: request.contactMethod,
      selectedTimeSlot: request.selectedTimeSlot,
      goals: request.goals,
      experience: request.experience || null,
      eatingOut: request.eatingOut || null,
      typicalDay: request.typicalDay || null,
      drinks: request.drinks || null,
      emotionalEating: request.emotionalEating || null,
      medications: request.medications || null,
      status: 'pending',
      createdAt: new Date(),
    };
    this.consultations.set(consultation.id, consultation);
    return consultation;
  }

  async getBookedSlots(): Promise<BookedSlot[]> {
    return Array.from(this.slots.values());
  }

  async bookTimeSlot(slot: InsertBookedSlot): Promise<BookedSlot> {
    const bookedSlot: BookedSlot = {
      id: this.nextId++,
      timeSlot: slot.timeSlot,
      consultationRequestId: slot.consultationRequestId || null,
      coachingCallId: slot.coachingCallId || null,
      bookedAt: new Date(),
    };
    this.slots.set(bookedSlot.id, bookedSlot);
    return bookedSlot;
  }

  async isTimeSlotAvailable(timeSlot: string): Promise<boolean> {
    return !Array.from(this.slots.values()).some(slot => slot.timeSlot === timeSlot);
  }

  async deleteBookedSlot(slotId: number): Promise<void> {
    this.slots.delete(slotId);
  }

  async deleteBookedSlotByRequestId(requestId: number): Promise<void> {
    const entries = Array.from(this.slots.entries());
    for (const [id, slot] of entries) {
      if (slot.consultationRequestId === requestId) {
        this.slots.delete(id);
        break;
      }
    }
  }

  async createCoachingCall(call: InsertCoachingCall): Promise<CoachingCall> {
    const coachingCall: CoachingCall = {
      id: this.nextId++,
      firstName: call.firstName,
      lastName: call.lastName,
      email: call.email,
      phone: call.phone,
      contactMethod: call.contactMethod,
      selectedTimeSlot: call.selectedTimeSlot,
      goals: call.goals,
      duration: call.duration,
      amount: call.amount,
      stripePaymentIntentId: call.stripePaymentIntentId || null,
      status: 'pending',
      rolloverMinutes: null,
      createdAt: new Date(),
    };
    this.calls.set(coachingCall.id, coachingCall);
    return coachingCall;
  }

  async getCoachingCalls(): Promise<CoachingCall[]> {
    return Array.from(this.calls.values());
  }

  async updateCoachingCallStatus(callId: number, status: string, paymentIntentId?: string): Promise<void> {
    const call = this.calls.get(callId);
    if (call) {
      call.status = status;
      if (paymentIntentId) {
        call.stripePaymentIntentId = paymentIntentId;
      }
      this.calls.set(callId, call);
    }
  }

  async getCoachingCall(callId: number): Promise<CoachingCall | undefined> {
    return this.calls.get(callId);
  }
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

// Initialize storage with fallback to memory storage if database fails
let storageInstance: IStorage;

async function initializeStorage(): Promise<IStorage> {
  try {
    const dbStorage = new DatabaseStorage();
    // Test the connection with a simple operation
    await dbStorage.getUser('test-connection');
    console.log('Database connection successful, using DatabaseStorage');
    return dbStorage;
  } catch (error: any) {
    console.warn('Database connection failed, falling back to MemoryStorage:', error.message);
    return new MemoryStorage();
  }
}

// Initialize storage on first use
export const getStorage = async (): Promise<IStorage> => {
  if (!storageInstance) {
    storageInstance = await initializeStorage();
  }
  return storageInstance;
};

// For compatibility with existing code, use memory storage as default
export const storage = new MemoryStorage();
