import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import headers from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    // TODO: Grant user access in Supabase database instantly upon payment success
    console.log('Payment successful for session:', session.id)
  }

  return NextResponse.json({ received: true })
}
