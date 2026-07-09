'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle, LogIn } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', { email, password, redirect: false })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="w-full max-w-sm bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] p-8">
      <div className="text-center mb-8">
        <p className="text-xs font-sans font-semibold tracking-widest text-[#C9A96E] uppercase mb-1">Hotel Tamarind Tree</p>
        <h1 className="font-serif text-2xl font-semibold text-[#2C1A12]">Staff Login</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-sans font-semibold text-[#6D5840] mb-2 uppercase tracking-wider">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-[#E5DDD3] bg-[#FAF7F2] text-[#2C1A12] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#5e1e12]/30 focus:border-[#5e1e12] transition-colors"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={15} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-700 font-sans">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#5e1e12] text-white font-sans font-semibold text-sm rounded hover:bg-[#7a2a1c] disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
