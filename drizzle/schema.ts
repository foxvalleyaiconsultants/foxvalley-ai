// ============================================================
// FILE: drizzle/schema.ts (REPLACE the existing file entirely)
// Standalone Auth — adds passwordHash column, removes openId dependency
// ============================================================

import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Users table with standalone password-based authentication.
 * The openId column is kept for backward compatibility but is no longer
 * required for login. New users get a generated unique ID.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  /** Unique identifier — for standalone auth this is a generated UUID */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  /** Username for login — must be unique */
  username: varchar("username", { length: 100 }).unique(),
  /** Bcrypt-hashed password */
  passwordHash: varchar("passwordHash", { length: 255 }),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ---- All other tables remain unchanged ----

export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  featuredImage: text("featuredImage"),
  readTime: int("readTime").notNull(),
  publishedAt: timestamp("publishedAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  authorId: int("authorId").notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  website: varchar("website", { length: 255 }),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

export const newsletterSignups = mysqlTable("newsletter_signups", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NewsletterSignup = typeof newsletterSignups.$inferSelect;
export type InsertNewsletterSignup = typeof newsletterSignups.$inferInsert;

export const socialLinks = mysqlTable("social_links", {
  id: int("id").autoincrement().primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull().unique(),
  url: varchar("url", { length: 500 }).notNull(),
  isActive: int("isActive").default(1).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SocialLink = typeof socialLinks.$inferSelect;
export type InsertSocialLink = typeof socialLinks.$inferInsert;
