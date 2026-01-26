# Deal or No Deal

A fun, interactive web implementation of the classic TV game show **Deal or No Deal** built with React, TypeScript, Vite, and a Node.js backend.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Running the Development Server](#running-the-development-server)
- [Build for Production](#build-for-production)
- [Contributing](#contributing)
- [License](#license)

## Features

- Dynamic case selection with real‑time updates via Socket.io.
- Server‑driven game logic and session management.
- Stylish UI with modern CSS effects (glassmorphism, gradients, micro‑animations).

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Styled‑Components
- **Backend**: Node.js, Express, Socket.io
- **Styling**: Vanilla CSS with custom design system (dark mode, gradients)
- **Networking**: Axios for HTTP requests, Socket.io client for real‑time communication

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/dealOrNoDeal.git
cd dealOrNoDeal

# Install dependencies for both client and server
npm install   # installs root dev dependencies (Vite, TypeScript, etc.)
cd client && npm install && cd ..
cd server && npm install && cd ..
```

## Running the Development Server

```bash
# Start the backend (default port 3000)
cd server
npm run dev   # or whatever script is defined in server/package.json

# In a new terminal, start the frontend
cd client
npm run dev   # Vite dev server (usually http://localhost:5173)
```

The frontend will automatically connect to the backend via the URL defined in `client/src/api/axios.ts` (environment variable `VITE_API_URL`).

## Build for Production

```bash
cd client
npm run build   # Generates optimized static files in `dist/`
```

Deploy the contents of `client/dist` to any static hosting service and run the Node.js server to handle game sessions and Socket.io connections.

