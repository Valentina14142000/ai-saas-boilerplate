import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()
    
    // Using a free public endpoint or fetch call to an AI provider like Groq or Google Gemini API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || 'your_groq_api_key'}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content || 'AI generated fallback response.'

    return NextResponse.json({ success: true, result: aiResponse })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
