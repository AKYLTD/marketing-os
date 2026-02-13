import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout completed:', session.id);

        if (session.customer_email) {
          const subscription = await stripe.subscriptions.list({
            customer: session.customer as string,
            limit: 1,
          });

          if (subscription.data.length > 0) {
            const sub = subscription.data[0];
            const priceId = sub.items.data[0]?.price.id;

            let tier = 'basic';
            if (priceId === process.env.STRIPE_GOLD_PRICE_ID) {
              tier = 'gold';
            } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
              tier = 'enterprise';
            }

            console.log(`User ${session.customer_email} upgraded to ${tier}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', subscription.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', subscription.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
