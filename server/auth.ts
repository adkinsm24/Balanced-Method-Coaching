import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, registerUserSchema, loginUserSchema } from "@shared/schema";
import connectPg from "connect-pg-simple";
import MemoryStore from "memorystore";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string): Promise<boolean> {
  // Check if it's a bcrypt hash (from course purchases)
  if (stored.startsWith('$2b$')) {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(supplied, stored);
  }
  
  // Legacy scrypt hash format
  const [hashed, salt] = stored.split(".");
  if (!salt) return false;
  
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const MemStore = MemoryStore(session);
  
  // Use memory store to avoid database connection issues
  // This is more reliable for development and handles Neon connectivity issues
  const store = new MemStore({
    checkPeriod: 86400000 // prune expired entries every 24h
  });
  
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'development-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req: any, email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.hashedPassword))) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          
          // Check if user has an active session on a different device
          if (user.activeSessionId && user.activeSessionId !== req.sessionID) {
            // Clear the old session and update with new one
            await storage.updateUserSession(user.id, req.sessionID);
          } else {
            // Update session tracking
            await storage.updateUserSession(user.id, req.sessionID);
          }
          
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const validation = registerUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Validation failed", 
          errors: validation.error.errors 
        });
      }

      const { email, password, firstName, lastName } = validation.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await hashPassword(password);
      const user = await storage.createUser({
        email,
        hashedPassword,
        firstName,
        lastName,
      });

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password hash back to client
        const { hashedPassword: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/login", (req, res, next) => {
    const validation = loginUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: validation.error.errors 
      });
    }

    passport.authenticate("local", (err: any, user: SelectUser, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        // Don't send password hash back to client
        const { hashedPassword: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", async (req, res, next) => {
    try {
      const user = req.user as any;
      if (user && user.id) {
        // Clear the user's active session
        await storage.clearUserSession(user.id);
      }
      
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    } catch (error) {
      console.error("Logout error:", error);
      req.logout((err) => {
        if (err) return next(err);
        res.sendStatus(200);
      });
    }
  });

  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.sendStatus(401);
    }
    // Don't send password hash back to client and ensure proper field mapping
    const user = req.user as any;
    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      hasCourseAccess: user.hasCourseAccess || user.has_course_access,
      profileImageUrl: user.profileImageUrl,
      stripeCustomerId: user.stripeCustomerId
    };
    res.json(userResponse);
  });
}

export function isAuthenticated(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}