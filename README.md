# live-polling-app

A real-time polling application that allows users to create, queue, and participate in live polls with instant vote updates. Built with a modern stack for both backend and frontend, supporting one vote per connection and a dynamic poll queue.

---

## Features

- Real-time poll creation and voting
- One vote per connection enforced
- Poll queue management
- WebSocket-based live updates
- Modern, accessible UI with TailwindCSS
- TypeScript throughout backend and frontend

---

## Project Structure

```
live-polling-app/
├── backend/      # Node.js, Express, WebSocket server, database, API
├── frontend/     # React app (Vite, TailwindCSS), UI components
├── shared/       # Shared TypeScript types/interfaces/enums
└── README.md     # Project documentation
```

### Backend (`backend/`)

- `src/` - Main server code (API, WebSocket, poll logic)
- `migrations/` - Database migration scripts
- `config/` - Database configuration
- `models/`, `controllers/`, `services/`, `managers/` - App logic

### Frontend (`frontend/`)

- `src/` - React app source code
- `components/` - UI components (polls, forms, etc)
- `pages/` - Page-level components
- `hooks/` - Custom React hooks
- `assets/` - Static assets (CSS, images)

### Shared (`shared/`)

- `interfaces/` - TypeScript interfaces for poll data, options, etc
- `enums/` - Shared enums (e.g., WebSocket events)

---

## Tech Stack

- **Backend:** Node.js, Express, WebSocket, SQLite, Knex, TypeScript
- **Frontend:** React, Vite, TailwindCSS, TypeScript
- **Shared:** TypeScript interfaces and enums

---

## Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

---

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd live-polling-app
```

### 2. Install dependencies

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## Database Setup (Backend)

The backend uses SQLite. Migrations are managed with Knex and run automatically on prepare.
To run migration manually:

```bash
cd backend
npm run init-database
```

---

## Running the App

### Backend

Start the backend server (API + WebSocket):

```bash
cd backend
npm run dev
```

### Frontend

Start the frontend React app:

```bash
cd frontend
npm run dev
```

---

## Development

- **Backend:**
    - `npm run dev` — Start backend in development mode (with nodemon)
- **Frontend:**
    - `npm run dev` — Start frontend in development mode (Vite)

---

## Usage Notes

- Only one vote per connection is allowed for each poll.
- Polls are managed in a queue; new polls can be added and will be activated in order.
- All poll and vote updates are sent in real-time via WebSocket.
