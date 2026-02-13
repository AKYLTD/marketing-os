import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

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

    // Find user and update tier
    const existingUser = db.user.findByEmail(session.user.email);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const user = db.user.update(existingUser.id, {
      tier: tier.toLowerCase(),
    });

    return NextResponse.json(
      { success: true, user },
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
