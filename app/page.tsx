'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function LandingPage() {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert('Checkout error. Please configure Stripe keys.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="inline-block px-4 py-1.5 mb-6 text-xs font-semibold tracking-wide uppercase bg-indigo-950/80 text-indigo-400 rounded-full border border-indigo-800/50">
        🚀 The Ultimate Full-Stack AI Boilerplate
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold max-w-4xl tracking-tight mb-6">
        Ship Your AI Startup in <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Hours, Not Weeks</span>
      </h1>
      <p className="text-lg text-zinc-400 max-w-2xl mb-10">
        Pre-configured with Next.js App Router, Tailwind CSS, Supabase Auth & Database, and Stripe billing. Everything you need to start making money instantly.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
        <button 
          onClick={handleCheckout}
          disabled={loading}
          className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 font-bold rounded-xl transition shadow-lg shadow-indigo-600/20 cursor-pointer"
        >
          {loading ? 'Processing...' : 'Get Started Now ($99)'}
        </button>
        <Link 
          href="/login"
          className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 font-bold rounded-xl transition flex items-center justify-center"
        >
          Sign In
        </Link>
      </div>
    </div>
  )
}
