import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature') as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const customerEmail = session.customer_details?.email

    if (customerEmail) {
      // Initialize Supabase admin or client to update user status
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            get() { return undefined },
          },
        }
      )

      // Example: Update user profile to premium/lifetime status
      await supabase
        .from('profiles')
        .update({ is_pro: true, stripe_customer_id: session.customer })
        .eq('email', customerEmail)
    }
  }

  return new NextResponse(null, { status: 200 })
}
