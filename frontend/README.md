# QuickPoll 🗳️

## [![Live Demo](https://img.shields.io/badge/demo-live-success)](https://quick-pol1.vercel.app/)

<a href="https://your-link.com" target="_blank">
  <img src="./public/image.png" alt="Quick Poll" />
</a>

> A modern, real-time polling platform built with Next.js and FastAPI that enables instant vote tracking and engagement through WebSocket technology.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Variables](#environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Development Phases](#-development-phases)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview
QuickPoll is a real-time polling application that allows users to create polls, vote on them, and see results update instantly. Built with modern web technologies, it provides a seamless and interactive polling experience with live updates powered by WebSockets.

### Core Capabilities

- **Create Polls**: Design polls with custom questions and multiple choice options
- **Real-time Voting**: Cast votes and watch results update instantly across all connected clients
- **Social Engagement**: Like polls to show appreciation and track popularity
- **Live Updates**: WebSocket-powered real-time synchronization of votes and likes
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop devices

---

## ✨ Features

| Feature | Description | Backend Endpoint | Frontend Implementation |
|---------|-------------|------------------|------------------------|
| 📊 **View Polls** | Browse all available polls with current results | `GET /api/polls` | Main dashboard page |
| 🆕 **Create Polls** | Create custom polls with multiple options | `POST /api/polls` | Dynamic form with option builder |
| 🗳️ **Vote** | Cast single-choice votes on any poll | `POST /api/polls/{poll_id}/vote` | Interactive button with API integration |
| ❤️ **Like/Unlike** | Show appreciation for polls | `POST/DELETE /api/polls/{poll_id}/like` | Toggle button with live count |
| 🔄 **Real-time Sync** | Instant updates across all clients | WebSocket `/api/polls/ws` | React hooks with WebSocket listener |
| 📱 **Responsive UI** | Seamless experience on any device | — | CSS + Tailwind CSS + framer-motion |


---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **UI Components**: shadcn/ui
- **HTTP Client**: Axios
- **Real-time**: WebSocket API

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: SQLite (development) / PostgreSQL (production)
- **Real-time**: WebSockets
- **ASGI Server**: Uvicorn

### DevOps & Deployment
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **Version Control**: Git & GitHub

---

## 🏗️ Architecture

### System Design

```
┌─────────────────────────────────────┐
│      Next.js Frontend               │
│   React + TypeScript + Tailwind     │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  Components                   │  │
│  │  • Poll List                  │  │
│  │  • Poll Creator               │  │
│  │  • Vote Interface             │  │
│  │  • Real-time Updates          │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               │ REST API + WebSocket
               │
┌──────────────▼──────────────────────┐
│      FastAPI Backend                │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  API Routes                   │  │
│  │  • Poll Management            │  │
│  │  • Vote Handling              │  │
│  │  • Like System                │  │
│  │  • WebSocket Manager          │  │
│  └───────────────────────────────┘  │
│                                     │
│  ┌───────────────────────────────┐  │
│  │  SQLAlchemy ORM               │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │
               ▼
     ┌──────────────────┐
     │   Database Layer │
     │                  │
     │  • Polls         │
     │  • Options       │
     │  • Votes         │
     │  • Likes         │
     └──────────────────┘
```

### Real-time Data Flow

1. **User Action**: User votes or likes a poll via the frontend
2. **API Request**: Frontend sends HTTP request to backend endpoint
3. **Database Update**: Backend processes request and updates database
4. **WebSocket Broadcast**: Backend emits event to all connected WebSocket clients
5. **UI Update**: All clients receive update and refresh their displays instantly

### Database Schema

```
Polls
├── id (Primary Key)
├── question (Text)
├── created_at (Timestamp)
└── options (One-to-Many)

Options
├── id (Primary Key)
├── poll_id (Foreign Key)
├── text (Text)
└── votes (One-to-Many)

Votes
├── id (Primary Key)
├── option_id (Foreign Key)
├── user_id (Text)
└── timestamp (Timestamp)

Likes
├── id (Primary Key)
├── poll_id (Foreign Key)
├── user_id (Text)
└── timestamp (Timestamp)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **pip** (Python package manager)
- **Git**

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/Bhupendra-Maurya/QuickPoll.git
cd QuickPoll/backend
```

2. **Create and activate virtual environment**
```bash
# Create virtual environment
python -m venv venv

# Activate it
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Initialize the database**
```bash
# The database will be created automatically on first run
python -m alembic upgrade head  # If using migrations
```

5. **Run the development server**
```bash
uvicorn main:app --reload
```

The backend API will be available at: **http://localhost:8000**

API documentation (Swagger): **http://localhost:8000/docs**

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at: **http://localhost:3000**

### Environment Variables

#### Frontend (`.env.local`)
Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8000/api/polls/ws
```

#### Backend (`.env`)
Create a `.env` file in the `backend` directory:

```env
VITE_FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:///./app.db

# Optional: For production
# DATABASE_URL=postgresql://user:password@localhost/quickpoll
```

---

## 📚 API Documentation

### Polls

#### Get All Polls
```http
GET /api/polls
```

**Response**
```json
[
  {
    "id": "uuid",
    "question": "What's your favorite programming language?",
    "options": [
      {
        "id": "uuid",
        "text": "Python",
        "vote_count": 42
      }
    ],
    "like_count": 15,
    "created_at": "2025-10-27T10:30:00Z"
  }
]
```

#### Create Poll
```http
POST /api/polls
Content-Type: application/json

{
  "question": "What's your favorite programming language?",
  "options": ["Python", "JavaScript", "Rust", "Go"]
}
```

#### Vote on Poll
```http
POST /api/polls/{poll_id}/vote
Content-Type: application/json

{
  "option_id": "uuid",
  "user_id": "user-identifier"
}
```

#### Like/Unlike Poll
```http
POST /api/polls/{poll_id}/like
Content-Type: application/json

{
  "user_id": "user-identifier"
}
```
<!-- 
```http
DELETE /api/polls/{poll_id}/like?user_id=user-identifier
```

### WebSocket

#### Connect to Real-time Updates
```javascript
const ws = new WebSocket('ws://localhost:8000/api/polls/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Update received:', data);
};


``` -->

**Event Types**
- `vote`: Sent when a vote is cast
- `like`: Sent when a poll is liked/unliked

<!-- ## 📁 Project Structure

```
QuickPoll/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── models.py               # SQLAlchemy database models
│   ├── schemas.py              # Pydantic schemas for validation
│   ├── database.py             # Database configuration
│   ├── routes/
│   │   ├── polls.py            # Poll endpoints
│   │   ├── votes.py            # Vote endpoints
│   │   └── likes.py            # Like endpoints
│   ├── websocket.py            # WebSocket connection manager
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx        # Home page (poll list)
    │   │   ├── create/
    │   │   │   └── page.tsx    # Create poll page
    │   │   └── poll/
    │   │       └── [id]/
    │   │           └── page.tsx # Poll details page
    │   ├── components/
    │   │   ├── PollCard.tsx    # Poll display component
    │   │   ├── VoteButton.tsx  # Vote interaction
    │   │   └── CreatePollForm.tsx
    │   ├── lib/
    │   │   ├── api.ts          # API client
    │   │   └── websocket.ts    # WebSocket client
    │   └── types/
    │       └── poll.ts         # TypeScript interfaces
    ├── public/
    │   └── image.png           # Assets
    ├── package.json
    ├── tsconfig.json
    └── .env.local              # Environment variables
``` -->

---

## 🔄 Development Phases

### Phase 1: Backend Foundation
- [x] Initialize FastAPI application
- [x] Create database models (Poll, Option, Vote, Like)
- [x] Setup SQLite database with SQLAlchemy
- [x] Implement REST API endpoints
- [x] Add WebSocket support for real-time updates

### Phase 2: Frontend Development
- [x] Initialize Next.js with TypeScript
- [x] Configure Tailwind CSS and Framer Motion
- [x] Create core pages (Home, Create Poll, Poll Details)
- [x] Implement API integration using Axios
- [x] Setup WebSocket listener for live updates

### Phase 3: Real-time Integration
- [x] Connect frontend to WebSocket endpoint
- [x] Implement live vote and like count updates
- [x] Optimize UI performance and transitions
- [x] Add error handling and loading states

### Phase 4: Deployment & Polish
- [x] Deploy backend to Render
- [x] Deploy frontend to Vercel
- [x] Configure production environment variables
- [x] Performance optimization and testing

---

## 🌐 Deployment

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure build settings:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables
6. Deploy

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com
   NEXT_PUBLIC_WS_BASE_URL=wss://your-backend.onrender.com/api/polls/ws
   ```
5. Deploy

---

## 👨‍💻 Author

**Bhupendra Maurya**

- GitHub: [@Bhupendra-Maurya](https://github.com/Bhupendra-Maurya)
- Project Link: [https://github.com/Bhupendra-Maurya/QuickPoll](https://github.com/Bhupendra-Maurya/QuickPoll)

---

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [Next.js](https://nextjs.org/) - React framework for production
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework


---

<p align="center">Made with ❤️ by Bhupendra</p>
<p align="center">⭐ Star this repo if you find it useful!</p>