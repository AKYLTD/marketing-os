import Stripe from "stripe";

// Lazy-init Stripe so we don't crash at build time when no key is set
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2024-12-18.acacia" as Stripe.LatestApiVersion });
  }
  return _stripe;
}

export const PLANS = {
  basic: {
    name: "Basic",
    price: 0,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || "",
    color: "#9CA3AF",
    features: [
      "Dashboard overview",
      "Basic analytics",
    ],
  },
  gold: {
    name: "Gold",
    price: 29,
    priceId: process.env.STRIPE_GOLD_PRICE_ID || "",
    color: "#F59E0B",
    popular: true,
    features: [
      "Everything in Basic",
      "Content calendar",
      "Media studio & uploads",
      "Publishing queue",
      "Brand DNA profile",
      "Channel management (6 channels)",
      "Campaign management",
      "Growth Lab experiments",
      "Special dates calendar",
      "Advanced analytics & reports",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    color: "#6366F1",
    features: [
      "Everything in Gold",
      "AI Marketing Chief (full chat)",
      "Persistent AI sidebar",
      "Admin panel & user management",
      "AI auto-scheduling",
      "AI campaign generation",
      "Revenue attribution",
      "Competitor monitoring",
      "Priority support",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

// Tier access control
export const TIER_ACCESS: Record<string, string[]> = {
  basic: ["dashboard"],
  gold: [
    "dashboard", "brand", "media", "calendar", "channels",
    "publishing", "analytics", "campaigns", "growth", "dates", "settings",
  ],
  enterprise: [
    "dashboard", "brand", "media", "calendar", "channels",
    "publishing", "analytics", "campaigns", "growth", "dates",
    "settings", "agent", "admin",
  ],
};

export function canAccess(tier: string, page: string): boolean {
  return TIER_ACCESS[tier]?.includes(page) ?? false;
}
