# 🛒 LiveCart

Real-time shared shopping cart. Create a session, share the code, and shop together — cart updates sync instantly across all connected devices.

> Built because my mom and I shop together but couldn't see what the other had added to the cart.

**Live demo:** [live-cart-gold.vercel.app](https://live-cart-gold.vercel.app)

---

## Features

- **Real-time sync** — add, remove, or update quantities and every connected user sees it instantly
- **Session rooms** — create a cart session and share the 6-character code with anyone
- **Presence indicators** — see who's in the session with color-coded avatar initials
- **Product browsing** — filter by category, view sale badges, wishlist items
- **Persistent cart** — cart state lives on the server for the duration of the session

## Tech Stack

**Frontend**

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Socket.io client
- Lucide React

**Backend**

- Node.js + Express
- Socket.io
- TypeScript

**Infrastructure**

- Vercel (frontend)
- Railway (backend)

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Clone the repo
git clone https://github.com/terrence-celestine/livecart.git
cd livecart

# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Running locally

```bash
# From the root — starts both client and server
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3001

### Environment Variables

Create `client/.env.production`:

```
VITE_SERVER_URL=https://your-server.railway.app
```

Create `server/.env`:

```
PORT=3001
CLIENT_URL=http://localhost:5173
```

## How It Works

1. User enters their name and creates a session — the server generates a 6-character room code
2. A second user enters the code to join the same session
3. Both users are added to a Socket.io room on the server
4. Any cart action (add, update quantity, remove) emits a socket event to the server
5. The server updates the session cart and broadcasts `cart:updated` to everyone in the room
6. All connected clients update their cart state in real time

## Project Structure

```
livecart/
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── CartPanel.tsx
│   │   │   ├── Lobby.tsx
│   │   │   └── ProductCard.tsx
│   │   ├── data/
│   │   │   └── products.ts
│   │   ├── types.ts
│   │   └── App.tsx
└── server/                 # Node.js + Express backend
    └── src/
        └── index.ts
```
