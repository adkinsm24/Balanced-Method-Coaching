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
  // Configure session store with PostgreSQL for production reliability
  const PgStore = connectPg(session);
  let store;
  
  try {
    // Use PostgreSQL session store for better session management
    store = new PgStore({
      pool: pool,
      tableName: 'sessions',
      createTableIfMissing: true,
      pruneSessionInterval: 60 * 15, // Clean up expired sessions every 15 minutes
      errorLog: (error: Error) => {
        console.error('Session store error:', error);
      }
    });
    console.log('Using PostgreSQL session store');
  } catch (error) {
    console.warn('PostgreSQL session store failed, falling back to memory store:', error);
    // Fallback to memory store if PostgreSQL fails
    const MemStore = MemoryStore(session);
    store = new MemStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }
  
  // Session configuration with 30-minute idle timeout
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'development-secret-key-change-in-production',
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create sessions until something is stored
    store: store,
    rolling: true, // Reset expiration on activity (this enables idle timeout behavior)
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: IDLE_TIMEOUT, // 30 minutes idle timeout
      sameSite: 'lax' // Improved security
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  // Set up periodic cleanup of expired sessions
  setupSessionCleanup();

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req: any, email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user || !(await comparePasswords(password, user.hashedPassword))) {
            return done(null, false, { message: 'Invalid email or password' });
          }
          
          // Check if user already has an active session (prevent concurrent logins)
          if (!user.isAdmin && user.activeSessionId) {
            // Only allow login if the session ID matches (same device/browser) or if the stored session is expired
            if (user.activeSessionId !== req.sessionID) {
              // Check if the stored session is still valid
              const existingSession = await checkSessionExists(user.activeSessionId);
              if (existingSession) {
                return done(null, false, { message: 'Account is already logged in on another device. Please log out first or wait for the session to expire.' });
              }
              // Session no longer exists, allow login
            }
          }
          
          // Update session tracking for all users (including admins for activity tracking)
          await storage.updateUserSession(user.id, req.sessionID);
          
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

  app.get("/api/auth/user", isAuthenticated, (req, res) => {
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

export async function isAuthenticated(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Get fresh user data to check current active session
    const user = await storage.getUser(req.user.id);
    if (!user) {
      // Clear session if user no longer exists
      req.logout((err) => {
        if (err) console.error('Logout error:', err);
      });
      return res.status(401).json({ message: "User not found" });
    }

    // Update last activity timestamp for idle timeout tracking
    await updateUserActivity(user.id);

    // Session validation for non-admin users
    if (!user.isAdmin && user.activeSessionId) {
      if (user.activeSessionId !== req.sessionID) {
        console.log(`Session mismatch detected for user ${user.email}: stored=${user.activeSessionId}, current=${req.sessionID}`);
        
        // For session conflicts, invalidate the current session
        req.logout((err) => {
          if (err) console.error('Logout error:', err);
        });
        
        await storage.clearUserSession(user.id);
        return res.status(401).json({ 
          message: "Session invalidated - account is logged in elsewhere. Please log in again.",
          code: "SESSION_CONFLICT"
        });
      }
    }
    
    // Touch the session to reset idle timeout on activity
    req.session.touch();
    
    return next();
  } catch (error) {
    console.error('Authentication check error:', error);
    return res.status(500).json({ message: "Authentication error" });
  }
}

// Helper function to update user activity timestamp
async function updateUserActivity(userId: number) {
  try {
    await storage.updateUserActivity(userId);
  } catch (error) {
    console.error('Failed to update user activity:', error);
    // Don't fail authentication for activity update errors
  }
}

// Helper function to check if a session exists in the session store
async function checkSessionExists(sessionId: string): Promise<boolean> {
  try {
    const result = await pool.query('SELECT sid FROM sessions WHERE sid = $1 AND expire > NOW()', [sessionId]);
    return result.rows.length > 0;
  } catch (error) {
    console.error('Failed to check session existence:', error);
    return false; // Assume session doesn't exist if we can't check
  }
}

// Setup periodic session cleanup to prevent abandoned session accumulation
function setupSessionCleanup() {
  const CLEANUP_INTERVAL = 15 * 60 * 1000; // 15 minutes
  const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes (matches session timeout)
  
  setInterval(async () => {
    try {
      // Clean up expired sessions from PostgreSQL sessions table
      await pool.query(`
        DELETE FROM sessions 
        WHERE expire < NOW()
      `);
      
      // Clear activeSessionId for users with old sessions (safety net)
      const cutoffTime = new Date(Date.now() - (IDLE_TIMEOUT * 2)); // 1 hour cutoff
      await pool.query(`
        UPDATE users 
        SET active_session_id = NULL, updated_at = NOW() 
        WHERE last_login_at < $1 AND active_session_id IS NOT NULL
      `, [cutoffTime]);
      
      console.log('Session cleanup completed');
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  }, CLEANUP_INTERVAL);
  
  console.log('Session cleanup job started (runs every 15 minutes)');
}