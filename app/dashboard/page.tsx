'use client'
import { useState } from 'react'

export default function DashboardPage() {
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      setOutput(data.result)
    } catch (err) {
      setOutput('Error generating response.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">AI Dashboard</h1>
        <p className="text-zinc-400 mb-8">Test your pre-wired AI generation pipeline below.</p>
        
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-6">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your AI prompt here..."
            className="w-full h-32 p-4 bg-zinc-950 border border-zinc-800 rounded-lg text-white mb-4 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-lg transition"
          >
            {loading ? 'Generating...' : 'Generate AI Output'}
          </button>
        </div>

        {output && (
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800">
            <h2 className="text-lg font-semibold mb-2">Output Result:</h2>
            <p className="text-zinc-300 whitespace-pre-wrap">{output}</p>
          </div>
        )}
      </div>
    </div>
  )
}
