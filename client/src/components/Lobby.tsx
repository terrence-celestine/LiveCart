import { useState } from 'react'

interface Props {
  onCreate: (username: string) => void
  onJoin: (username: string, code: string) => void
  error: string | null
}

export default function Lobby({ onCreate, onJoin, error }: Props) {
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'pick' | 'join'>('pick')

  const canProceed = username.trim().length > 0

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-sm p-6">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🛒</div>
          <h1 className="text-xl font-bold text-gray-900">LiveCart</h1>
          <p className="text-sm text-gray-400 mt-1">Shop together, live</p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
            Your name
          </label>
          <input
            type="text"
            placeholder="e.g. Mom, Terrence…"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {mode === 'pick' && (
          <div className="flex flex-col gap-3">
            <button
              disabled={!canProceed}
              onClick={() => onCreate(username.trim())}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Create a new cart
            </button>
            <button
              disabled={!canProceed}
              onClick={() => setMode('join')}
              className="w-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Join an existing cart
            </button>
          </div>
        )}

        {mode === 'join' && (
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">
                Session code
              </label>
              <input
                type="text"
                placeholder="e.g. ABC123"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono tracking-widest text-center"
              />
            </div>
            <button
              disabled={!canProceed || code.length < 6}
              onClick={() => onJoin(username.trim(), code)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Join cart
            </button>
            <button
              onClick={() => setMode('pick')}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors text-center"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}