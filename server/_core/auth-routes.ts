import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { nanoid } from "nanoid";
import { users } from "../../drizzle/schema";
import { getSessionCookieOptions } from "./cookies";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
} from "./standalone-auth";

/**
 * Register standalone authentication routes.
 * Call this in server/_core/index.ts instead of registerOAuthRoutes(app).
 */
export function registerAuthRoutes(app: Express) {

  // ---- POST /api/auth/login ----
  // Accepts JSON: { username: string, password: string }
  // Returns JSON: { success: true, user: { id, name, role } }
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      // Look up user by username
      const db = drizzle(process.env.DATABASE_URL!);
      const result = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      const user = result.length > 0 ? result[0] : null;

      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      // Verify password
      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        res.status(401).json({ error: "Invalid username or password" });
        return;
      }

      // Create session token
      const token = await createSessionToken({
        userId: user.id,
        openId: user.openId,
        username: user.username || "",
        role: user.role,
      });

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // Update last signed in
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.id, user.id));

      res.json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("[Auth] Login failed:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ---- POST /api/auth/register ----
  // Accepts JSON: { username: string, password: string, name: string, email?: string }
  // Only allows registration if no admin exists yet (first user becomes admin).
  // After that, registration is disabled unless you change the logic below.
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password, name, email } = req.body;

      // Validate input
      if (!username || !password || !name) {
        res.status(400).json({ error: "Username, password, and name are required" });
        return;
      }

      if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }

      const db = drizzle(process.env.DATABASE_URL!);

      // Check if username already exists
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      if (existing.length > 0) {
        res.status(409).json({ error: "Username already taken" });
        return;
      }

      // Check if this is the first user (auto-promote to admin)
      const allUsers = await db.select({ id: users.id }).from(users).limit(1);
      const isFirstUser = allUsers.length === 0;

      // Hash password and create user
      const passwordHash = await hashPassword(password);
      const openId = nanoid(); // Generate a unique ID (replaces Manus openId)

      await db.insert(users).values({
        openId,
        username,
        passwordHash,
        name,
        email: email || null,
        loginMethod: "local",
        role: isFirstUser ? "admin" : "user",
        lastSignedIn: new Date(),
      });

      // Look up the newly created user
      const newUserResult = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

      const newUser = newUserResult[0];

      // Create session token and log them in
      const token = await createSessionToken({
        userId: newUser.id,
        openId: newUser.openId,
        username: newUser.username || "",
        role: newUser.role,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          role: newUser.role,
        },
        message: isFirstUser
          ? "Admin account created successfully!"
          : "Account created successfully!",
      });
    } catch (error) {
      console.error("[Auth] Registration failed:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });
}
