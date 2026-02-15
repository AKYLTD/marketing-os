import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { eq, desc, and, gte, lte, ilike, or, sql as dsql } from "drizzle-orm";
import * as schema from "./schema";

// ─── Database connection ────────────────────────────────
// Uses POSTGRES_URL env var automatically from @vercel/postgres
export const database = drizzle(sql, { schema });

// Re-export schema and helpers for easy imports
export { schema, eq, desc, and, gte, lte, ilike, or, dsql };

// ─── Helper: get current user ID from session ───────────
export function getUserId(session: { user?: { id?: string } } | null): string {
  const id = session?.user?.id;
  if (!id) throw new Error("Unauthorized");
  return id;
}

// ─── Seed special dates helper ──────────────────────────
export const SPECIAL_DATES_2026 = [
  { title: "Valentine's Day", date: "2026-02-14", color: "#ec4899", type: "special_date" as const },
  { title: "National Bagel Day", date: "2026-02-09", color: "#f59e0b", type: "special_date" as const },
  { title: "St Patrick's Day", date: "2026-03-17", color: "#22c55e", type: "special_date" as const },
  { title: "Mother's Day", date: "2026-03-22", color: "#ec4899", type: "special_date" as const },
  { title: "Easter", date: "2026-04-05", color: "#a78bfa", type: "special_date" as const },
  { title: "Earth Day", date: "2026-04-22", color: "#22c55e", type: "special_date" as const },
  { title: "Father's Day", date: "2026-06-21", color: "#3b82f6", type: "special_date" as const },
  { title: "Summer Solstice", date: "2026-06-21", color: "#f59e0b", type: "special_date" as const },
  { title: "Halloween", date: "2026-10-31", color: "#f97316", type: "special_date" as const },
  { title: "Black Friday", date: "2026-11-27", color: "#1f2937", type: "special_date" as const },
  { title: "Cyber Monday", date: "2026-11-30", color: "#6366f1", type: "special_date" as const },
  { title: "Christmas", date: "2026-12-25", color: "#ef4444", type: "special_date" as const },
  { title: "New Year's Eve", date: "2026-12-31", color: "#8b5cf6", type: "special_date" as const },
];

// ─── Type exports ───────────────────────────────────────
export type User = typeof schema.users.$inferSelect;
export type NewUser = typeof schema.users.$inferInsert;
export type BrandProfile = typeof schema.brandProfiles.$inferSelect;
export type Channel = typeof schema.channels.$inferSelect;
export type Post = typeof schema.posts.$inferSelect;
export type Campaign = typeof schema.campaigns.$inferSelect;
export type Contact = typeof schema.contacts.$inferSelect;
export type ContactActivity = typeof schema.contactActivities.$inferSelect;
export type Voucher = typeof schema.vouchers.$inferSelect;
export type VoucherRedemption = typeof schema.voucherRedemptions.$inferSelect;
export type CalendarEvent = typeof schema.calendarEvents.$inferSelect;
export type GrowthExperiment = typeof schema.growthExperiments.$inferSelect;
export type AiSettings = typeof schema.aiSettings.$inferSelect;
