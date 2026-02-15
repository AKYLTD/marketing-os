import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { database, schema, eq, getUserId } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = getUserId(session);

    // Check if user is admin or enterprise tier
    const currentUser = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .then((r) => r[0]);

    if (!currentUser || (currentUser.role !== "admin" && currentUser.tier !== "enterprise")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const users = await database.select().from(schema.users);

    return NextResponse.json({ users });
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

    // Check if user is admin or enterprise tier
    const currentUser = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, userId))
      .then((r) => r[0]);

    if (!currentUser || (currentUser.role !== "admin" && currentUser.tier !== "enterprise")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { id, tier, role } = body;

    if (!id) {
      return NextResponse.json({ error: "User id required" }, { status: 400 });
    }

    const user = await database
      .update(schema.users)
      .set({
        tier,
        role,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, id))
      .returning()
      .then((r) => r[0]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
