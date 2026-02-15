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
      .from(schema.growthExperiments)
      .where(eq(schema.growthExperiments.userId, userId));

    if (status) {
      query = database
        .select()
        .from(schema.growthExperiments)
        .where(and(eq(schema.growthExperiments.userId, userId), eq(schema.growthExperiments.status, status)));
    }

    const experiments = await query.orderBy(desc(schema.growthExperiments.createdAt));

    return NextResponse.json({ experiments });
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

    const { name, hypothesis, description, status, category, priority, metrics, startDate, endDate } =
      body;

    const experiment = await database
      .insert(schema.growthExperiments)
      .values({
        userId,
        name,
        hypothesis,
        description,
        status: status || "idea",
        category,
        priority: priority || "medium",
        metrics,
        startDate,
        endDate,
      })
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ experiment }, { status: 201 });
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

    const { id, name, hypothesis, description, status, category, priority, metrics, results, startDate, endDate } =
      body;

    if (!id) {
      return NextResponse.json({ error: "Experiment id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.growthExperiments)
      .where(eq(schema.growthExperiments.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const experiment = await database
      .update(schema.growthExperiments)
      .set({
        name,
        hypothesis,
        description,
        status,
        category,
        priority,
        metrics,
        results,
        startDate,
        endDate,
        updatedAt: new Date(),
      })
      .where(eq(schema.growthExperiments.id, id))
      .returning()
      .then((r) => r[0]);

    return NextResponse.json({ experiment });
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
      return NextResponse.json({ error: "Experiment id required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await database
      .select()
      .from(schema.growthExperiments)
      .where(eq(schema.growthExperiments.id, id))
      .then((r) => r[0]);

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await database.delete(schema.growthExperiments).where(eq(schema.growthExperiments.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
