import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, and, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let query = database
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.userId, userId));

    if (status) {
      query = database
        .select()
        .from(schema.campaigns)
        .where(and(eq(schema.campaigns.userId, userId), eq(schema.campaigns.status, status)));
    }

    const campaigns = await query.orderBy(desc(schema.campaigns.createdAt));

    return NextResponse.json({ campaigns });
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

    const { name, description, status, type, budget, startDate, endDate, targetChannels, goals } =
      body;

    const campaign = await database
      .insert(schema.campaigns)
      .values({
        userId,
        name,
        description,
        status: status || "draft",
        type,
        budget,
        startDate,
        endDate,
        targetChannels,
        goals,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const { id, name, description, status, type, budget, startDate, endDate, targetChannels, goals } =
      body;

    if (!id) {
      return NextResponse.json({ error: "Campaign id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const campaign = await database
      .update(schema.campaigns)
      .set({
        name,
        description,
        status,
        type,
        budget,
        startDate,
        endDate,
        targetChannels,
        goals,
        updatedAt: new Date(),
      })
      .where(eq(schema.campaigns.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ campaign });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);
    const body = await request.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: "Campaign id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.campaigns)
      .where(eq(schema.campaigns.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.campaigns).where(eq(schema.campaigns.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
