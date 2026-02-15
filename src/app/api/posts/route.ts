import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, desc, and, ilike, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const platform = searchParams.get("platform");

    let query = database
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.userId, userId));

    if (status || platform) {
      const conditions = [eq(schema.posts.userId, userId)];
      if (status) conditions.push(eq(schema.posts.status, status));
      if (platform) conditions.push(eq(schema.posts.platform, platform));
      query = database
        .select()
        .from(schema.posts)
        .where(and(...conditions));
    }

    const posts = await query.orderBy(desc(schema.posts.createdAt));

    return NextResponse.json({ posts });
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

    const { title, content, platform, channelId, campaignId, status, scheduledAt, mediaUrls } =
      body;

    const post = await database
      .insert(schema.posts)
      .values({
        userId,
        title,
        content,
        platform,
        channelId,
        campaignId,
        status: status || "draft",
        scheduledAt,
        mediaUrls,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ post }, { status: 201 });
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

    const { id, title, content, platform, channelId, campaignId, status, scheduledAt, mediaUrls } =
      body;

    if (!id) {
      return NextResponse.json({ error: "Post id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const post = await database
      .update(schema.posts)
      .set({
        title,
        content,
        platform,
        channelId,
        campaignId,
        status,
        scheduledAt,
        mediaUrls,
        updatedAt: new Date(),
      })
      .where(eq(schema.posts.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ post });
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
      return NextResponse.json({ error: "Post id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.posts)
      .where(eq(schema.posts.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.posts).where(eq(schema.posts.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
