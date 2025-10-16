'use client'

import { useState } from 'react'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    setError(null)
    const t = topic.trim()
    if (!t) {
      setError('Please enter a topic')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      })
      if (res.ok) {
        setMessage("We're rendering your video. You’ll see it here when it’s ready.")
        setTopic('')
      } else {
        const data = await res.json().catch(() => ({} as any))
        setError(data?.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold mb-2">Clipoo</h1>
        <p className="text-sm text-gray-500 mb-8">Turn any topic into an AI-generated vertical short video.</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="e.g., Why the sky is blue"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white/5 px-4 py-3 outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/30"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-3 text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed dark:bg-white dark:text-black"
          >
            {loading ? 'Starting…' : 'Generate short video'}
          </button>
        </form>

        {message && (
          <div className="mt-6 rounded-md border border-green-400/40 bg-green-50 dark:bg-green-900/20 px-4 py-3 text-sm text-green-800 dark:text-green-200">
            {message}
          </div>
        )}
        {error && (
          <div className="mt-6 rounded-md border border-red-400/40 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        <div className="mt-10 text-xs text-gray-500">
          Future: we’ll surface the final video here automatically when rendering completes.
        </div>
      </div>
    </div>
  )
}
