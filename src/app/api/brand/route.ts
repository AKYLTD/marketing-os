import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const brand = await database
      .select()
      .from(schema.brandProfiles)
      .where(eq(schema.brandProfiles.userId, userId))
      .limit(1)
      .then((r) => r[0] || null);

    return NextResponse.json({ brand });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const {
      brandName,
      industry,
      description,
      maturity,
      direction,
      targetAudience,
      personality,
      voiceSettings,
      colors,
      competitors,
      logoUrl,
      websiteUrl,
    } = body;

    // Check if brand already exists
    const existing = await database
      .select()
      .from(schema.brandProfiles)
      .where(eq(schema.brandProfiles.userId, userId))
      .then((r) => r[0] || null);

    if (existing) {
      // Update
      const updated = await database
        .update(schema.brandProfiles)
        .set({
          brandName,
          industry,
          description,
          maturity,
          direction,
          targetAudience,
          personality,
          voiceSettings,
          colors,
          competitors,
          logoUrl,
          websiteUrl,
          updatedAt: new Date(),
        })
        .where(eq(schema.brandProfiles.id, existing.id))
        .returning()
        .then((r) => r[0]);

      return NextResponse.json({ brand: updated }, { status: 200 });
    } else {
      // Create
      const created = await database
        .insert(schema.brandProfiles)
        .values({
          userId,
          brandName,
          industry,
          description,
          maturity,
          direction,
          targetAudience,
          personality,
          voiceSettings,
          colors,
          competitors,
          logoUrl,
          websiteUrl,
        })
        .returning()
        .then((r) => r[0]);

      return NextResponse.json({ brand: created }, { status: 201 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
