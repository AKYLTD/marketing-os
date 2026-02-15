import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { database, schema, eq } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { tier } = body;

    if (!tier) {
      return NextResponse.json(
        { error: 'Missing tier parameter' },
        { status: 400 }
      );
    }

    // Validate tier
    const validTiers = ['basic', 'gold', 'enterprise'];
    if (!validTiers.includes(tier.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid tier' },
        { status: 400 }
      );
    }

    // Find user
    const existingUser = await database
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, session.user.email))
      .then(r => r[0] || null);

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update tier
    const updated = await database
      .update(schema.users)
      .set({ tier: tier.toLowerCase(), updatedAt: new Date() })
      .where(eq(schema.users.id, existingUser.id))
      .returning()
      .then(r => r[0]);

    return NextResponse.json(
      { success: true, user: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Select tier error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
