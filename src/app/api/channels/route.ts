import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const channels = await database
      .select()
      .from(schema.channels)
      .where(eq(schema.channels.userId, userId))
      .orderBy(desc(schema.channels.createdAt));

    return NextResponse.json({ channels });
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

    const { platform, handle, displayName, settings } = body;

    const channel = await database
      .insert(schema.channels)
      .values({
        userId,
        platform,
        handle,
        displayName,
        settings,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ channel }, { status: 201 });
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

    const { id, platform, handle, displayName, settings, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: "Channel id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.channels)
      .where(eq(schema.channels.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const channel = await database
      .update(schema.channels)
      .set({
        platform,
        handle,
        displayName,
        settings,
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(schema.channels.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ channel });
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
      return NextResponse.json({ error: "Channel id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.channels)
      .where(eq(schema.channels.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.channels).where(eq(schema.channels.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
