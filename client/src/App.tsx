import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:3001')

function App() {
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🛒 LiveCart</h1>
        <p className={connected ? 'text-green-400' : 'text-red-400'}>
          {connected ? '⚡ Connected to server' : '⏳ Connecting...'}
        </p>
      </div>
    </div>
  )
}

export default App