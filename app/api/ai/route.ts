import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Mock or integrate your AI model logic here (e.g., OpenAI SDK)
    const aiResponse = `Generated response for: "${prompt}"`

    return NextResponse.json({ result: aiResponse })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
