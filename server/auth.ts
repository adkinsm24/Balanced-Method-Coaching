import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { User, registerUserSchema, loginUserSchema } from "@shared/schema";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      hashedPassword: string;
      firstName: string | null;
      lastName: string | null;
      profileImageUrl: string | null;
      hasCourseAccess: boolean | null;
      stripeCustomerId: string | null;
      createdAt: Date | null;
      updatedAt: Date | null;
    }
  }
}

const saltRounds = 12;

async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

async function comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function setupAuth(app: Express) {
  // Session configuration
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    pool,
    createTableIfMissing: true,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'development-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
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

  // Passport Local Strategy
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
          }

          const isValidPassword = await comparePasswords(password, user.hashedPassword);
          if (!isValidPassword) {
            return done(null, false, { message: 'Invalid email or password' });
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
      done(null, user || null);
    } catch (error) {
      done(error);
    }
  });

  // Registration endpoint
  app.post("/api/register", async (req, res, next) => {
    try {
      const validatedData = registerUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      // Hash password and create user
      const hashedPassword = await hashPassword(validatedData.password);
      const newUser = await storage.createUser({
        email: validatedData.email,
        hashedPassword,
        firstName: validatedData.firstName || null,
        lastName: validatedData.lastName || null,
        profileImageUrl: null,
        hasCourseAccess: false,
        stripeCustomerId: null,
      });

      // Log the user in
      req.login(newUser, (err) => {
        if (err) return next(err);
        
        // Return user data without password
        const { hashedPassword: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Login endpoint
  app.post("/api/login", (req, res, next) => {
    try {
      loginUserSchema.parse(req.body);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
    }

    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: "Internal server error" });
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) {
          console.error('Login session error:', err);
          return res.status(500).json({ message: "Internal server error" });
        }
        
        // Return user data without password
        const { hashedPassword: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  // Logout endpoint
  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destruction error:', err);
          return res.status(500).json({ message: "Error logging out" });
        }
        res.clearCookie('connect.sid');
        res.json({ message: "Logged out successfully" });
      });
    });
  });

  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Return user data without password
    const { hashedPassword: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
}

export const isAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};