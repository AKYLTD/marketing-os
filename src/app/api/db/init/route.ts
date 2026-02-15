import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT,
        email TEXT UNIQUE NOT NULL,
        image TEXT,
        password TEXT,
        tier TEXT DEFAULT 'basic' NOT NULL,
        stripe_customer_id TEXT,
        role TEXT DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create brand_profiles table
    await sql`
      CREATE TABLE IF NOT EXISTS brand_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        brand_name TEXT NOT NULL,
        industry TEXT,
        description TEXT,
        maturity INTEGER DEFAULT 50,
        direction INTEGER DEFAULT 50,
        target_audience JSONB,
        personality JSONB,
        voice_settings JSONB,
        colors JSONB,
        competitors JSONB,
        logo_url TEXT,
        website_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create channels table
    await sql`
      CREATE TABLE IF NOT EXISTS channels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        platform TEXT NOT NULL,
        handle TEXT,
        display_name TEXT,
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        followers INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        settings JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create posts table
    await sql`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        channel_id UUID REFERENCES channels(id),
        campaign_id UUID,
        title TEXT NOT NULL,
        content TEXT,
        media_urls JSONB,
        platform TEXT,
        status TEXT DEFAULT 'draft' NOT NULL,
        scheduled_at TIMESTAMP,
        published_at TIMESTAMP,
        external_id TEXT,
        reach INTEGER DEFAULT 0,
        impressions INTEGER DEFAULT 0,
        engagement INTEGER DEFAULT 0,
        clicks INTEGER DEFAULT 0,
        revenue REAL DEFAULT 0,
        spend REAL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create campaigns table
    await sql`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'draft' NOT NULL,
        type TEXT,
        budget REAL DEFAULT 0,
        spent REAL DEFAULT 0,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        target_channels JSONB,
        goals JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create contacts table
    await sql`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        company TEXT,
        status TEXT DEFAULT 'lead' NOT NULL,
        source TEXT,
        tags JSONB,
        total_spent REAL DEFAULT 0,
        last_visit TIMESTAMP,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create contact_activities table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        contact_id UUID NOT NULL REFERENCES contacts(id),
        user_id UUID NOT NULL REFERENCES users(id),
        type TEXT NOT NULL,
        subject TEXT,
        content TEXT,
        metadata JSONB,
        scheduled_at TIMESTAMP,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create vouchers table
    await sql`
      CREATE TABLE IF NOT EXISTS vouchers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        code TEXT UNIQUE NOT NULL,
        description TEXT,
        discount_type TEXT DEFAULT 'percentage' NOT NULL,
        discount_value REAL NOT NULL,
        max_uses INTEGER DEFAULT 100,
        used_count INTEGER DEFAULT 0,
        min_order_value REAL DEFAULT 0,
        expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT true,
        target_audience TEXT DEFAULT 'all',
        target_emails JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create voucher_redemptions table
    await sql`
      CREATE TABLE IF NOT EXISTS voucher_redemptions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        voucher_id UUID NOT NULL REFERENCES vouchers(id),
        contact_id UUID REFERENCES contacts(id),
        email TEXT,
        order_value REAL,
        discount_applied REAL,
        redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create calendar_events table
    await sql`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        title TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'custom' NOT NULL,
        date TIMESTAMP NOT NULL,
        end_date TIMESTAMP,
        all_day BOOLEAN DEFAULT true,
        color TEXT,
        linked_post_id UUID,
        linked_campaign_id UUID,
        is_recurring BOOLEAN DEFAULT false,
        recurring_pattern TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, title, date, type)
      )
    `;

    // Create growth_experiments table
    await sql`
      CREATE TABLE IF NOT EXISTS growth_experiments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        name TEXT NOT NULL,
        hypothesis TEXT,
        description TEXT,
        status TEXT DEFAULT 'idea' NOT NULL,
        category TEXT,
        priority TEXT DEFAULT 'medium',
        metrics JSONB,
        results TEXT,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create ai_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS ai_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id),
        provider TEXT DEFAULT 'openai' NOT NULL,
        model TEXT DEFAULT 'gpt-4o-mini',
        temperature REAL DEFAULT 0.7,
        capabilities JSONB,
        custom_api_key TEXT,
        system_prompt TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Seed special dates for 2026 (system-wide, or seed for a demo user if needed)
    // Using INSERT ... ON CONFLICT to avoid duplicates
    const specialDates = [
      { title: "Valentine's Day", date: "2026-02-14", color: "#ec4899", type: "special_date" },
      { title: "National Bagel Day", date: "2026-02-09", color: "#f59e0b", type: "special_date" },
      { title: "St Patrick's Day", date: "2026-03-17", color: "#22c55e", type: "special_date" },
      { title: "Mother's Day", date: "2026-03-22", color: "#ec4899", type: "special_date" },
      { title: "Easter", date: "2026-04-05", color: "#a78bfa", type: "special_date" },
      { title: "Earth Day", date: "2026-04-22", color: "#22c55e", type: "special_date" },
      { title: "Father's Day", date: "2026-06-21", color: "#3b82f6", type: "special_date" },
      { title: "Summer Solstice", date: "2026-06-21", color: "#f59e0b", type: "special_date" },
      { title: "Halloween", date: "2026-10-31", color: "#f97316", type: "special_date" },
      { title: "Black Friday", date: "2026-11-27", color: "#1f2937", type: "special_date" },
      { title: "Cyber Monday", date: "2026-11-30", color: "#6366f1", type: "special_date" },
      { title: "Christmas", date: "2026-12-25", color: "#ef4444", type: "special_date" },
      { title: "New Year's Eve", date: "2026-12-31", color: "#8b5cf6", type: "special_date" },
    ];

    // Check if we should seed special dates (only seed if there's no demo/system user yet)
    // For now, we'll skip seeding if there are no users to avoid orphaned events
    const userCount = await sql`SELECT COUNT(*) FROM users`;
    if (userCount && userCount[0] && (userCount[0].count as number) === 0) {
      // Create a system user for special dates if needed
      const systemUser = await sql`
        INSERT INTO users (email, name, role, tier)
        VALUES (${"system@marketing-os.local"}, ${"System"}, ${"admin"}, ${"enterprise"})
        ON CONFLICT (email) DO NOTHING
        RETURNING id
      `;

      if (systemUser && systemUser.length > 0) {
        const systemUserId = systemUser[0].id;

        // Seed special dates
        for (const event of specialDates) {
          await sql`
            INSERT INTO calendar_events (
              user_id,
              title,
              type,
              date,
              all_day,
              color,
              created_at
            ) VALUES (
              ${systemUserId},
              ${event.title},
              ${event.type},
              ${event.date}::timestamp,
              true,
              ${event.color},
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (user_id, title, date, type) DO NOTHING
          `;
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "All database tables created successfully and special dates seeded",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
