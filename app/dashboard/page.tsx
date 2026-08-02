'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [prompt, setPrompt] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        setUserEmail(user.email || null)
      }
    }
    getUser()
  }, [router, supabase])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate response')
      }

      setOutput(data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 hidden md:block">
        <div className="flex items-center gap-2 mb-8">
          <span className="font-bold text-lg text-gray-900 dark:text-white">AI SaaS Kit</span>
        </div>
        <nav className="space-y-2">
          <Link href="/dashboard" className="block px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium dark:bg-indigo-950/50 dark:text-indigo-400">
            Overview & AI Playground
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="w-full text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              Sign Out
            </button>
          </form>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Welcome back, {userEmail || 'Loading...'}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Generator Playground */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI Content Generator</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Test your Groq-powered AI pipeline instantly.</p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Your Prompt
                </label>
                <textarea
                  rows={3}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask the AI anything (e.g., Write 3 catchy marketing hooks for a SaaS startup)..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors disabled:opacity-50"
              >
                {loading ? 'Generating AI Response...' : 'Generate with AI'}
              </button>
            </form>

            {output && (
              <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700 relative">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Result</span>
                  <button
                    onClick={handleCopy}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
                  >
                    Copy Output
                  </button>
                </div>
                <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{output}</p>
              </div>
            )}
          </div>

          {/* Subscription Status Card */}
          <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Subscription</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">You are currently on the Free Tier.</p>
            <form action="/api/checkout" method="POST">
              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
              >
                Upgrade to Lifetime ($99)
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
