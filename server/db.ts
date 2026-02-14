import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, blogPosts, InsertBlogPost, contactMessages, InsertContactMessage, newsletterSignups, InsertNewsletterSignup, socialLinks, InsertSocialLink } from "../drizzle/schema";

import { desc } from "drizzle-orm";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Blog post queries
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(blogPosts).orderBy(desc(blogPosts.publishedAt));
  return result;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(post: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(blogPosts).values(post);
  return result;
}

export async function updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(blogPosts).set(post).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// Contact message queries
export async function getAllContactMessages() {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  return result;
}

export async function createContactMessage(message: InsertContactMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contactMessages).values(message);
  return result;
}

export async function markMessageAsRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contactMessages).set({ isRead: 1 }).where(eq(contactMessages.id, id));
}

// Newsletter functions
export async function createNewsletterSignup(email: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(newsletterSignups).values({ email });
  return result;
}

export async function getAllNewsletterSignups() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(newsletterSignups).orderBy(desc(newsletterSignups.createdAt));
  return result;
}

// Social links functions
export async function getAllSocialLinks() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(socialLinks);
  return result;
}

export async function upsertSocialLink(link: InsertSocialLink) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(socialLinks).values(link).onDuplicateKeyUpdate({
    set: {
      url: link.url,
      isActive: link.isActive ?? 1,
    },
  });
}
