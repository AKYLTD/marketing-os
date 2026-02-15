import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const settings = await database
      .select()
      .from(schema.aiSettings)
      .where(eq(schema.aiSettings.userId, userId))
      .limit(1)
      .then((r) => r[0] || null);

    return NextResponse.json({ settings });
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

    const { provider, model, temperature, capabilities, customApiKey, systemPrompt } = body;

    // Check if settings already exist
    const existing = await database
      .select()
      .from(schema.aiSettings)
      .where(eq(schema.aiSettings.userId, userId))
      .then((r) => r[0] || null);

    if (existing) {
      // Update
      const updated = await database
        .update(schema.aiSettings)
        .set({
          provider,
          model,
          temperature,
          capabilities,
          customApiKey,
          systemPrompt,
          updatedAt: new Date(),
        })
        .where(eq(schema.aiSettings.id, existing.id))
        .returning()
        .then((r) => r[0]);

      return NextResponse.json({ settings: updated }, { status: 200 });
    } else {
      // Create
      const created = await database
        .insert(schema.aiSettings)
        .values({
          userId,
          provider: provider || "openai",
          model: model || "gpt-4o-mini",
          temperature: temperature ?? 0.7,
          capabilities,
          customApiKey,
          systemPrompt,
        })
        .returning()
        .then((r) => r[0]);

      return NextResponse.json({ settings: created }, { status: 201 });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
