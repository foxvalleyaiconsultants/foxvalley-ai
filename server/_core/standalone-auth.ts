import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
import type { Request } from "express";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, type User } from "../../drizzle/schema";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";

// ---- Bcrypt import (install with: pnpm add bcryptjs && pnpm add -D @types/bcryptjs) ----
import bcrypt from "bcryptjs";

// ---- Configuration ----
const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-in-production";
const SALT_ROUNDS = 12;

// ---- Helper: get the secret as Uint8Array for jose ----
function getSecretKey() {
  return new TextEncoder().encode(JWT_SECRET);
}

// ---- Password hashing utilities ----

/**
 * Hash a plaintext password using bcrypt.
 * @param password - The plaintext password to hash
 * @returns The bcrypt hash string
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plaintext password against a bcrypt hash.
 * @param password - The plaintext password to verify
 * @param hash - The stored bcrypt hash
 * @returns true if the password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---- JWT Session utilities ----

export type SessionPayload = {
  userId: number;
  openId: string;
  username: string;
  role: string;
};

/**
 * Create a signed JWT session token.
 * @param payload - User data to embed in the token
 * @param expiresInMs - Token lifetime in milliseconds (default: 1 year)
 * @returns Signed JWT string
 */
export async function createSessionToken(
  payload: SessionPayload,
  expiresInMs: number = ONE_YEAR_MS
): Promise<string> {
  const issuedAt = Date.now();
  const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);

  return new SignJWT({
    userId: payload.userId,
    openId: payload.openId,
    username: payload.username,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(expirationSeconds)
    .sign(getSecretKey());
}

/**
 * Verify a JWT session token and extract the payload.
 * @param token - The JWT string from the session cookie
 * @returns Decoded payload or null if invalid/expired
 */
export async function verifySessionToken(
  token: string | undefined | null
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
    });

    const { userId, openId, username, role } = payload as Record<string, unknown>;

    if (
      typeof userId !== "number" ||
      typeof openId !== "string" ||
      typeof username !== "string" ||
      typeof role !== "string"
    ) {
      console.warn("[Auth] Session payload missing required fields");
      return null;
    }

    return { userId, openId, username, role };
  } catch (error) {
    console.warn("[Auth] Session verification failed:", String(error));
    return null;
  }
}

// ---- Request authentication ----

/**
 * Authenticate an incoming Express request by reading the session cookie,
 * verifying the JWT, and looking up the user in the database.
 *
 * This function is a drop-in replacement for sdk.authenticateRequest().
 *
 * @param req - Express Request object
 * @returns The authenticated User row, or throws ForbiddenError
 */
export async function authenticateRequest(req: Request): Promise<User> {
  // Parse cookies from the request header
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader
    ? new Map(Object.entries(parseCookieHeader(cookieHeader)))
    : new Map<string, string>();

  const sessionCookie = cookies.get(COOKIE_NAME);
  const session = await verifySessionToken(sessionCookie);

  if (!session) {
    throw ForbiddenError("Invalid or missing session");
  }

  // Look up the user in the database
  const db = drizzle(process.env.DATABASE_URL!);
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, session.openId))
    .limit(1);

  const user = result.length > 0 ? result[0] : null;

  if (!user) {
    throw ForbiddenError("User not found");
  }

  return user;
}
