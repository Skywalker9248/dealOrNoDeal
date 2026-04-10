# Deal or No Deal

A fun, interactive web implementation of the classic TV game show **Deal or No Deal** built with React, TypeScript, Vite, and a Node.js backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Development Server](#running-the-development-server)
- [Build for Production](#build-for-production)

## Features

- Real-time case opening and game state sync via Socket.io
- AI-powered Banker with persuasive offers using OpenRouter (5 free models with automatic ping race — fastest model per session wins, waterfall fallback if any fail)
- Server-driven game logic and session management
- Input validation on all API routes with Zod
- Rate limiting on session creation
- Stylish UI with glassmorphism, gradients, and micro-animations

## Tech Stack

**Frontend**
- React 19, TypeScript, Vite
- Styled-Components
- Axios, Socket.io client

**Backend**
- Node.js, Hono, `@hono/node-server`
- Socket.io
- Zod + `@hono/zod-validator` for request validation
- `hono-rate-limiter` for rate limiting
- Native `fetch` for AI API calls (no axios on server)

## Project Structure

```
dealOrNoDeal/
├── client/               # React frontend
│   ├── src/
│   │   ├── api/          # Axios instance + session API calls
│   │   ├── socket/       # Socket.io client helpers
│   │   ├── components/   # UI components
│   │   └── provider/     # React context + game state
│   └── .env              # VITE_API_URL
└── server/               # Hono backend
    ├── controllers/      # Game logic, session management, AI banker
    ├── routes/           # Hono routers
    ├── validators/       # Zod schemas
    └── .env              # OPENROUTER_API_KEY, FRONTEND_URL
```

## Installation

```bash
# Clone the repository
git clone https://github.com/Skywalker9248/dealOrNoDeal.git
cd dealOrNoDeal

# Install client dependencies
cd client && yarn install && cd ..

# Install server dependencies
cd server && yarn install && cd ..
```

## Environment Variables

**`client/.env`**
```
VITE_API_URL=http://localhost:3001
```

**`server/.env`**
```
FRONTEND_URL=http://localhost:5173
OPENROUTER_API_KEY=your_openrouter_api_key
```

Get a free OpenRouter API key at [openrouter.ai](https://openrouter.ai).

## Running the Development Server

```bash
# Start the backend (port 3001)
cd server
yarn dev

# In a new terminal, start the frontend (port 5173)
cd client
yarn dev
```

## Build for Production

```bash
cd client
yarn build   # outputs to client/dist/
```

Deploy `client/dist/` to any static host (Vercel, Netlify, CF Pages) and run the Node.js server on any platform that supports WebSockets (Render, Railway, Fly.io).

Set `VITE_API_URL` to your deployed backend URL before building the frontend.
