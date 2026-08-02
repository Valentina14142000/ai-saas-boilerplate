'use client'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <div className="w-full max-w-md p-8 bg-zinc-900 border border-zinc-800 rounded-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Welcome Back</h1>
        <p className="text-sm text-zinc-400 mb-6 text-center">Sign in to access your AI starter kit dashboard.</p>
        <button 
          onClick={() => alert('Connect Supabase Auth OAuth/Email here!')}
          className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
        >
          Sign In with Email / Google
        </button>
      </div>
    </main>
  )
}
