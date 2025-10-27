
## 🧩 1. Project Breakdown

### **Core Goal**

Build a real-time polling platform (**QuickPoll**) where users can:

* Create polls (with multiple options)
* Vote on polls
* Like polls
* See real-time updates for votes and likes (WebSocket or Server-Sent Events)
* Interact through a clean, responsive UI

---

### **Feature Breakdown**

| Feature                           | Description                                              | Backend                                 | Frontend                              |
| --------------------------------- | -------------------------------------------------------- | --------------------------------------- | ------------------------------------- 
|
 📊 Get Polls                   | To see all the polls            | `/api/polls` GET endpoint           | Default/main page        |
 📊 Create Polls                   | Create polls with question + multiple options            | `/api/polls` POST endpoint           | Form with dynamic option inputs       |
| 🗳️ Vote                          | Vote on any poll (single choice)                         | `/api/polls/{poll_id}/vote` endpoint        | Button click triggers API call        |
| ❤️ Like                           | Like/unlike polls                                        | `/api/polls/{poll_id}/like` endpoint        | Like button with real-time count      |
| 🔄 Real-time updates              | See votes and likes update instantly                     | WebSockets or FastAPI background events | React hooks for live state updates    |
| 📱 Responsive UI                  | Fully responsive for mobile/desktop                      | —                                       | Tailwind + shadcn components          |

---

### **Development Phases**

1. **Phase 1 – Backend Setup**

   * Initialize FastAPI app
   * Create models: Poll, Option, Vote, Like
   * Setup database (SQLite or PostgreSQL)
   * Create REST APIs for CRUD operations
   * Add WebSocket endpoint for real-time updates

2. **Phase 2 – Frontend Setup**

   * Initialize Next.js + TypeScript project
   * Configure Tailwind + shadcn/ui
   * Create pages: `Home`, `CreatePoll`, `PollDetails`
   * Implement API integration via Axios/fetch
   * Setup WebSocket listener for real-time updates

3. **Phase 3 – Integration & Real-Time**

   * Connect frontend to WebSocket
   * Reflect live vote and like counts
   * Optimize UI performance and UX

4. **Phase 4 – Deployment**

   * Deploy backend (Render / Railway)
   * Deploy frontend (Vercel)
   * Add environment variables & API base URLs

---

## 🏗️ 2. Architecture & System Design

### **High-Level Overview**

```
┌────────────────────────────┐
│        Next.js Frontend    │
│   React + TypeScript + UI  │
│ ┌────────────────────────┐ │
│ │ Poll List / Create UI │ │
│ │ WebSocket Updates     │ │
│ └────────────────────────┘ │
└────────────┬───────────────┘
             │ REST + WS
             ▼
┌────────────────────────────┐
│        FastAPI Backend     │
│ ┌────────────────────────┐ │
│ │ Poll Routes            │ │
│ │ Vote Routes            │ │
│ │ Like Routes            │ │
│ │ WebSocket Manager      │ │
│ └────────────────────────┘ │
│        SQLAlchemy ORM      │
│        SQLite/Postgres     │
└────────────┬───────────────┘
             │
             ▼
     🗄️ Database Layer
     (Polls, Options, Votes, Likes)
```

---

### **System Components**

| Component                           | Description                                                                                                |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Frontend (Next.js + TypeScript)** | Displays polls, results, and handles user interactions in real time.                                       |
| **Backend (FastAPI)**               | Provides REST endpoints for poll CRUD, voting, and liking; manages WebSocket connections for live updates. |
| **Database (SQLite)**    | Stores poll data, votes, and likes.                                                                        |
| **WebSocket Manager**               | Handles multiple active connections and broadcasts updates when a vote or like occurs.                     |

---

### **Real-Time Flow**

1. User votes or likes a poll → Frontend sends API request to backend.
2. Backend updates DB and triggers a **WebSocket broadcast** event with updated counts.
3. All connected clients receive the event and update their UI live.

---

## 🧰 3. Tech Stack

| Layer                   | Technology                                              |
| ----------------------- | ------------------------------------------------------- |
| **Frontend**            | Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui  |
| **Backend**             | FastAPI, SQLAlchemy, WebSockets                         |
| **Database**            | SQLite (local)                  |
| **Hosting (Optional)**  | Frontend → Vercel / Netlify, Backend → Render / Railway |
| **Real-time Transport** | WebSockets                                              |
| **Version Control**     | GitHub                                                  |

---

## 🧪 4. Local Setup Guide

### **Backend Setup**

```bash
# Clone repository
git clone https://github.com/Bhupendra-Maurya/QuickPoll
cd quickpoll/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run FastAPI app
uvicorn main:app --reload
```

Server runs at: `http://localhost:8000`

---

### **Frontend Setup**

```bash
cd ../frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

App runs at: `http://localhost:3000`

---

### **Environment Variables**

Create `.env.local` in frontend:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Create `.env` in backend:

```
DATABASE_URL=sqlite:///./polls.db
```
---

## 🎥 6. Demo Video

