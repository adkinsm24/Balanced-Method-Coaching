import {
  users,
  consultationRequests,
  bookedSlots,
  coachingCalls,
  type User,
  type UpsertUser,
  type InsertUser,
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
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  grantCourseAccess(userId: number): Promise<void>;
  
  // Booking operations
  createConsultationRequest(request: InsertConsultationRequest): Promise<ConsultationRequest>;
  getBookedSlots(): Promise<BookedSlot[]>;
  bookTimeSlot(slot: InsertBookedSlot): Promise<BookedSlot>;
  bookTimeSlotWithDuration(timeSlot: string, duration: number, consultationRequestId?: number, coachingCallId?: number): Promise<BookedSlot[]>;
  isTimeSlotAvailable(timeSlot: string): Promise<boolean>;
  areConsecutiveSlotsAvailable(timeSlot: string): Promise<boolean>;
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
  private users: Map<number, User> = new Map();
  private consultations: Map<number, ConsultationRequest> = new Map();
  private slots: Map<number, BookedSlot> = new Map();
  private calls: Map<number, CoachingCall> = new Map();
  private nextUserId = 1;
  private nextId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextUserId++,
      email: userData.email,
      hashedPassword: userData.hashedPassword,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      hasCourseAccess: userData.hasCourseAccess ?? false,
      stripeCustomerId: userData.stripeCustomerId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.id) {
      const existingUser = this.users.get(userData.id);
      if (existingUser) {
        const updatedUser: User = {
          ...existingUser,
          ...userData,
          updatedAt: new Date(),
        };
        this.users.set(userData.id, updatedUser);
        return updatedUser;
      }
    }
    
    // Create new user for upsert (backwards compatibility)
    const user: User = {
      id: userData.id ?? this.nextUserId++,
      email: userData.email ?? '',
      hashedPassword: '', // This method is for backwards compatibility
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      hasCourseAccess: true, // Grant course access automatically for demo purposes
      stripeCustomerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async grantCourseAccess(userId: number): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.hasCourseAccess = true;
      user.updatedAt = new Date();
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
      duration: slot.duration || 30,
      isSecondarySlot: slot.isSecondarySlot || false,
      primarySlotId: slot.primarySlotId || null,
      consultationRequestId: slot.consultationRequestId || null,
      coachingCallId: slot.coachingCallId || null,
      bookedAt: new Date(),
    };
    this.slots.set(bookedSlot.id, bookedSlot);
    return bookedSlot;
  }

  async bookTimeSlotWithDuration(timeSlot: string, duration: number, consultationRequestId?: number, coachingCallId?: number): Promise<BookedSlot[]> {
    const bookedSlots: BookedSlot[] = [];
    
    // Book primary slot
    const primarySlot: BookedSlot = {
      id: this.nextId++,
      timeSlot: timeSlot,
      duration: duration,
      isSecondarySlot: false,
      primarySlotId: null,
      consultationRequestId: consultationRequestId || null,
      coachingCallId: coachingCallId || null,
      bookedAt: new Date(),
    };
    this.slots.set(primarySlot.id, primarySlot);
    bookedSlots.push(primarySlot);

    // For 45 and 60 minute calls, book the next slot as well
    if (duration > 30) {
      const nextSlot = this.getNextTimeSlot(timeSlot);
      if (nextSlot) {
        const secondarySlot: BookedSlot = {
          id: this.nextId++,
          timeSlot: nextSlot,
          duration: duration,
          isSecondarySlot: true,
          primarySlotId: primarySlot.id,
          consultationRequestId: consultationRequestId || null,
          coachingCallId: coachingCallId || null,
          bookedAt: new Date(),
        };
        this.slots.set(secondarySlot.id, secondarySlot);
        bookedSlots.push(secondarySlot);
      }
    }

    return bookedSlots;
  }

  private getNextTimeSlot(currentSlot: string): string | null {
    // Extract date and time from slot format: "2025-06-23-6am"
    const parts = currentSlot.split('-');
    if (parts.length < 4) return null;
    
    const date = parts.slice(0, 3).join('-');
    const time = parts[3];
    
    const timeOrder = ['6am', '630am', '7am', '730am', '8am', '830am', '9am', '930am', '10am', '1030am', '11am', '1130am', '12pm', '1230pm', '1pm', '130pm', '2pm', '230pm', '3pm', '330pm', '4pm', '430pm', '5pm', '530pm', '6pm', '630pm', '7pm', '730pm', '8pm', '830pm', '9pm', '930pm', '10pm', '1030pm', '11pm', '1130pm'];
    
    const currentIndex = timeOrder.indexOf(time);
    if (currentIndex === -1 || currentIndex === timeOrder.length - 1) return null;
    
    const nextTime = timeOrder[currentIndex + 1];
    return `${date}-${nextTime}`;
  }

  async isTimeSlotAvailable(timeSlot: string): Promise<boolean> {
    return !Array.from(this.slots.values()).some(slot => slot.timeSlot === timeSlot);
  }

  async areConsecutiveSlotsAvailable(timeSlot: string): Promise<boolean> {
    const nextSlot = this.getNextTimeSlot(timeSlot);
    if (!nextSlot) return false;
    
    const currentAvailable = await this.isTimeSlotAvailable(timeSlot);
    const nextAvailable = await this.isTimeSlotAvailable(nextSlot);
    
    return currentAvailable && nextAvailable;
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
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.id) {
      const [user] = await db
        .insert(users)
        .values({
          ...userData,
          hashedPassword: '', // For upsert compatibility
        })
        .onConflictDoUpdate({
          target: users.email,
          set: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            profileImageUrl: userData.profileImageUrl,
            updatedAt: new Date(),
          },
        })
        .returning();
      return user;
    }
    
    // Create new user
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        hashedPassword: '', // For upsert compatibility
      })
      .returning();
    return user;
  }

  async grantCourseAccess(userId: number): Promise<void> {
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

  async bookTimeSlotWithDuration(timeSlot: string, duration: number, consultationRequestId?: number, coachingCallId?: number): Promise<BookedSlot[]> {
    const bookedSlots: BookedSlot[] = [];
    
    // Book primary slot
    const [primarySlot] = await db
      .insert(bookedSlots)
      .values({
        timeSlot: timeSlot,
        duration: duration,
        isSecondarySlot: false,
        primarySlotId: null,
        consultationRequestId: consultationRequestId || null,
        coachingCallId: coachingCallId || null,
      })
      .returning();
    bookedSlots.push(primarySlot);

    // For 45 and 60 minute calls, book the next slot as well
    if (duration > 30) {
      const nextSlot = this.getNextTimeSlot(timeSlot);
      if (nextSlot) {
        const [secondarySlot] = await db
          .insert(bookedSlots)
          .values({
            timeSlot: nextSlot,
            duration: duration,
            isSecondarySlot: true,
            primarySlotId: primarySlot.id,
            consultationRequestId: consultationRequestId || null,
            coachingCallId: coachingCallId || null,
          })
          .returning();
        bookedSlots.push(secondarySlot);
      }
    }

    return bookedSlots;
  }

  private getNextTimeSlot(currentSlot: string): string | null {
    // Extract date and time from slot format: "2025-06-23-6am"
    const parts = currentSlot.split('-');
    if (parts.length < 4) return null;
    
    const date = parts.slice(0, 3).join('-');
    const time = parts[3];
    
    const timeOrder = ['6am', '630am', '7am', '730am', '8am', '830am', '9am', '930am', '10am', '1030am', '11am', '1130am', '12pm', '1230pm', '1pm', '130pm', '2pm', '230pm', '3pm', '330pm', '4pm', '430pm', '5pm', '530pm', '6pm', '630pm', '7pm', '730pm', '8pm', '830pm', '9pm', '930pm', '10pm', '1030pm', '11pm', '1130pm'];
    
    const currentIndex = timeOrder.indexOf(time);
    if (currentIndex === -1 || currentIndex === timeOrder.length - 1) return null;
    
    const nextTime = timeOrder[currentIndex + 1];
    return `${date}-${nextTime}`;
  }

  async isTimeSlotAvailable(timeSlot: string): Promise<boolean> {
    const [existingSlot] = await db
      .select()
      .from(bookedSlots)
      .where(eq(bookedSlots.timeSlot, timeSlot));
    return !existingSlot;
  }

  async areConsecutiveSlotsAvailable(timeSlot: string): Promise<boolean> {
    const nextSlot = this.getNextTimeSlot(timeSlot);
    if (!nextSlot) return false;
    
    const currentAvailable = await this.isTimeSlotAvailable(timeSlot);
    const nextAvailable = await this.isTimeSlotAvailable(nextSlot);
    
    return currentAvailable && nextAvailable;
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

// Use database storage for production
const databaseStorage = new DatabaseStorage();

export const storage = databaseStorage;
