import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const httpServer = createServer(app)

const io = new Server(httpServer, {
    cors: {
      origin: [
        'http://localhost:5173',
        process.env.CLIENT_URL || ''
      ],
      methods: ['GET', 'POST']
    }
})

app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Track sessions: sessionId -> { cart, members }
interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  addedBy: string
}

interface Session {
  cart: CartItem[]
  members: Map<string, string> // socketId -> username
}

const sessions = new Map<string, Session>()

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

io.on('connection', (socket) => {
  console.log(`⚡ Connected: ${socket.id}`)

  // Create a new session
  socket.on('session:create', ({ username }: { username: string }) => {
    const sessionId = generateCode()
    sessions.set(sessionId, {
      cart: [],
      members: new Map([[socket.id, username]])
    })
    socket.join(sessionId)
    socket.emit('session:joined', { sessionId, cart: [], members: [username] })
    console.log(`🆕 Session created: ${sessionId} by ${username}`)
  })

  // Join an existing session
  socket.on('session:join', ({ sessionId, username }: { sessionId: string, username: string }) => {
    const session = sessions.get(sessionId.toUpperCase())
    if (!session) {
      socket.emit('session:error', { message: 'Session not found. Check your code and try again.' })
      return
    }
    session.members.set(socket.id, username)
    socket.join(sessionId.toUpperCase())

    const members = Array.from(session.members.values())
    socket.emit('session:joined', { sessionId: sessionId.toUpperCase(), cart: session.cart, members })

    // Tell everyone else someone joined
    socket.to(sessionId.toUpperCase()).emit('session:member_joined', { username, members })
    console.log(`👋 ${username} joined session ${sessionId.toUpperCase()}`)
  })

  // Handle disconnect
  socket.on('disconnect', () => {
    sessions.forEach((session, sessionId) => {
      if (session.members.has(socket.id)) {
        const username = session.members.get(socket.id)
        session.members.delete(socket.id)
        const members = Array.from(session.members.values())
        io.to(sessionId).emit('session:member_left', { username, members })

        // Clean up empty sessions
        if (session.members.size === 0) {
          sessions.delete(sessionId)
          console.log(`🗑 Session ${sessionId} deleted (empty)`)
        }
      }
    })
    console.log(`❌ Disconnected: ${socket.id}`)
  })

  // Add item to cart
socket.on('cart:add', ({ sessionId, item }: { sessionId: string, item: CartItem }) => {
    const session = sessions.get(sessionId)
    if (!session) return
  
    const existing = session.cart.find(i => i.productId === item.productId)
    if (existing) {
      existing.quantity += 1
    } else {
      session.cart.push(item)
    }
  
    io.to(sessionId).emit('cart:updated', { cart: session.cart })
  })
  
  // Update quantity / remove
  socket.on('cart:update', ({ sessionId, productId, quantity }: { sessionId: string, productId: string, quantity: number }) => {
    const session = sessions.get(sessionId)
    if (!session) return
  
    if (quantity <= 0) {
      session.cart = session.cart.filter(i => i.productId !== productId)
    } else {
      const item = session.cart.find(i => i.productId === productId)
      if (item) item.quantity = quantity
    }
  
    io.to(sessionId).emit('cart:updated', { cart: session.cart })
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})