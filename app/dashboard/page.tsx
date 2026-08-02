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
  const [appending, setAppending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
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
    setCopied(false)

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

  const handleReadMore = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!output.trim()) return

    setAppending(true)
    setError(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Provide a detailed continuation, deeper history, and further insights into the following text: ${output}` }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch more information')
      }

      setOutput((prev) => prev + '\n\n' + data.result)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setAppending(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpgrading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize checkout')
      }

      if (data.url) {
        window.location.assign(data.url)
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (err: any) {
      setError(err.message)
      setUpgrading(false)
    }
  }

  return (
    <div className="flex min-h-screen text-slate-100 bg-gray-950">
      {/* Sidebar */}
      <aside className="w-72 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-6 hidden md:flex md:flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">AI</span>
            </div>
            <span className="font-bold tracking-tight text-white text-lg">SaaS Studio</span>
          </div>
          <nav className="space-y-1.5">
            <Link href="/dashboard" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/20 shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Playground
            </Link>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="mb-4 px-2">
            <p className="text-xs text-slate-400 truncate">Signed in as</p>
            <p className="text-xs font-medium text-slate-200 truncate">{userEmail}</p>
          </div>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-slate-800/80">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">AI Content Playground</h1>
            <p className="text-sm text-slate-400 mt-1">Leverage high-speed Groq models to generate top-tier copy and insights.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              API Connected
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Generator Workspace */}
          <div className="lg:col-span-2 p-6 lg:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <h3 className="text-xl font-semibold text-white mb-1">Prompt Studio</h3>
            <p className="text-sm text-slate-400 mb-6">Describe what you want the AI to create for you.</p>

            {error && (
              <div className="mb-6 rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 flex items-center gap-3">
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                {error}
              </div>
            )}

            <form onSubmit={handleGenerate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Instruction Prompt
                </label>
                <textarea
                  rows={4}
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Write a viral announcement tweet for our new AI product launch..."
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3.5 text-slate-100 placeholder-slate-500 shadow-inner focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 hover:from-indigo-500 hover:to-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Synthesizing response...
                  </>
                ) : (
                  <>
                    Generate Output
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </form>

            {output && (
              <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-slate-800/80 relative animate-fadeIn">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">AI Response</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleReadMore}
                      disabled={loading || appending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all disabled:opacity-50"
                    >
                      {appending ? (
                        <>
                          <svg className="animate-spin w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          <span>Reading more...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          <span>Read More</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all"
                    >
                      {copied ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          Copy text
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{output}</div>
              </div>
            )}
          </div>

          {/* Subscription & Account Status Card */}
          <div className="p-6 lg:p-8 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl h-fit flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">License Tier</h3>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Free Plan
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-6">Unlock unlimited generational quotas, priority processing, and advanced templates.</p>
            </div>

            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-violet-950/40 border border-indigo-500/20 mb-6">
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span className="text-slate-300">Lifetime Access Pass</span>
                <span className="text-white font-bold">$99</span>
              </div>
              <p className="text-xs text-slate-400">One-time payment. No recurring monthly subscription fees.</p>
            </div>

            <form onSubmit={handleUpgrade}>
              <button
                type="submit"
                disabled={upgrading}
                className="w-full rounded-2xl bg-white hover:bg-slate-100 text-slate-950 px-4 py-3 text-sm font-bold shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {upgrading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <span>Upgrade to Lifetime</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}