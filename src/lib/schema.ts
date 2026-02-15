import {
  pgTable,
  text,
  timestamp,
  integer,
  boolean,
  real,
  uuid,
  jsonb,
} from "drizzle-orm/pg-core";

// ─── USERS ──────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").unique().notNull(),
  image: text("image"),
  password: text("password"),
  tier: text("tier").default("basic").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  role: text("role").default("user").notNull(), // user | admin
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── BRAND PROFILES ─────────────────────────────────────
export const brandProfiles = pgTable("brand_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  brandName: text("brand_name").notNull(),
  industry: text("industry"),
  description: text("description"),
  maturity: integer("maturity").default(50), // 0-100
  direction: integer("direction").default(50), // 0=maintain, 100=reinvent
  targetAudience: jsonb("target_audience"), // { ageRange, gender, interests, location }
  personality: jsonb("personality"), // { traits: [{name, value}] }
  voiceSettings: jsonb("voice_settings"), // { formality, humor, energy }
  colors: jsonb("colors"), // { primary, secondary, accent }
  competitors: jsonb("competitors"), // [{ name, url }]
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CHANNELS ───────────────────────────────────────────
export const channels = pgTable("channels", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  platform: text("platform").notNull(), // instagram, facebook, tiktok, linkedin, twitter, youtube, email
  handle: text("handle"),
  displayName: text("display_name"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),
  followers: integer("followers").default(0),
  isActive: boolean("is_active").default(true),
  settings: jsonb("settings"), // channel-specific settings
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── POSTS ──────────────────────────────────────────────
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  channelId: uuid("channel_id").references(() => channels.id),
  campaignId: uuid("campaign_id"),
  title: text("title").notNull(),
  content: text("content"),
  mediaUrls: jsonb("media_urls"), // string[]
  platform: text("platform"),
  status: text("status").default("draft").notNull(), // draft, scheduled, published, failed
  scheduledAt: timestamp("scheduled_at"),
  publishedAt: timestamp("published_at"),
  externalId: text("external_id"), // ID from the social platform
  reach: integer("reach").default(0),
  impressions: integer("impressions").default(0),
  engagement: integer("engagement").default(0),
  clicks: integer("clicks").default(0),
  revenue: real("revenue").default(0),
  spend: real("spend").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CAMPAIGNS ──────────────────────────────────────────
export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").default("draft").notNull(), // draft, active, paused, completed
  type: text("type"), // awareness, engagement, conversion, seasonal
  budget: real("budget").default(0),
  spent: real("spent").default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  targetChannels: jsonb("target_channels"), // string[]
  goals: jsonb("goals"), // { metric, target, current }[]
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CONTACTS (CRM) ────────────────────────────────────
export const contacts = pgTable("contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company"),
  status: text("status").default("lead").notNull(), // lead, prospect, customer, vip, churned
  source: text("source"), // website, social, referral, walk-in, email
  tags: jsonb("tags"), // string[]
  totalSpent: real("total_spent").default(0),
  lastVisit: timestamp("last_visit"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── CONTACT ACTIVITIES ─────────────────────────────────
export const contactActivities = pgTable("contact_activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  contactId: uuid("contact_id").references(() => contacts.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // email, call, note, follow_up, purchase, visit
  subject: text("subject"),
  content: text("content"),
  metadata: jsonb("metadata"), // { outcome, duration, etc. }
  scheduledAt: timestamp("scheduled_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── VOUCHERS ───────────────────────────────────────────
export const vouchers = pgTable("vouchers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  code: text("code").unique().notNull(),
  description: text("description"),
  discountType: text("discount_type").default("percentage").notNull(), // percentage, fixed
  discountValue: real("discount_value").notNull(),
  maxUses: integer("max_uses").default(100),
  usedCount: integer("used_count").default(0),
  minOrderValue: real("min_order_value").default(0),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  targetAudience: text("target_audience").default("all"), // all, tier:gold, specific
  targetEmails: jsonb("target_emails"), // string[] for specific targeting
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── VOUCHER REDEMPTIONS ────────────────────────────────
export const voucherRedemptions = pgTable("voucher_redemptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  voucherId: uuid("voucher_id").references(() => vouchers.id).notNull(),
  contactId: uuid("contact_id").references(() => contacts.id),
  email: text("email"),
  orderValue: real("order_value"),
  discountApplied: real("discount_applied"),
  redeemedAt: timestamp("redeemed_at").defaultNow().notNull(),
});

// ─── CALENDAR EVENTS ────────────────────────────────────
export const calendarEvents = pgTable("calendar_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").default("custom").notNull(), // custom, post, campaign, special_date
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  allDay: boolean("all_day").default(true),
  color: text("color"),
  linkedPostId: uuid("linked_post_id"),
  linkedCampaignId: uuid("linked_campaign_id"),
  isRecurring: boolean("is_recurring").default(false),
  recurringPattern: text("recurring_pattern"), // yearly, monthly, weekly
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── GROWTH EXPERIMENTS ─────────────────────────────────
export const growthExperiments = pgTable("growth_experiments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  hypothesis: text("hypothesis"),
  description: text("description"),
  status: text("status").default("idea").notNull(), // idea, active, paused, completed
  category: text("category"), // content, engagement, acquisition, retention
  priority: text("priority").default("medium"), // low, medium, high
  metrics: jsonb("metrics"), // { metric, baseline, target, current }[]
  results: text("results"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── AI SETTINGS ────────────────────────────────────────
export const aiSettings = pgTable("ai_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  provider: text("provider").default("openai").notNull(), // openai, anthropic, google
  model: text("model").default("gpt-4o-mini"),
  temperature: real("temperature").default(0.7),
  capabilities: jsonb("capabilities"), // { contentGeneration, scheduling, analytics, etc. }
  customApiKey: text("custom_api_key"), // user's own API key
  systemPrompt: text("system_prompt"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
