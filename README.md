# AI Mock Interview

AI Mock Interview is a full-stack mock interview platform built for technical interview practice. The app combines a React + TypeScript frontend with a Django REST API to generate interview questions, capture candidate responses, score answers with AI, and track interview integrity signals such as eye movement, lip movement, and smart-device use.

## Overview

This project is designed to simulate a realistic technical interview flow:

- Candidates sign in and choose their experience level and technology stack
- The backend generates a set of interview questions using Groq-powered AI
- The frontend captures answers with webcam and microphone permissions
- Interview responses are stored and evaluated with AI scoring feedback
- The application tracks suspicious behavior and records warning events during the session
- A final report summarizes the candidate's performance and interview insights

## Current status

This repository is a functioning local prototype for an AI-powered mock interview platform. The end-to-end flow is implemented across the React frontend and Django backend: authentication, interview setup, AI question generation, answer capture, evaluation, warning tracking, and interview reporting all work together in a local development environment.

The project is not yet production-ready. It is best treated as a development/demo application that still needs hardening around deployment, monitoring, automated testing, production configuration, and operational polish.

## Tech stack

- Frontend: React 19, TypeScript, Vite, React Router
- Styling: Tailwind CSS
- Authentication: Clerk
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL
- AI: Groq
- Media monitoring: TensorFlow.js, MediaPipe, browser webcam APIs

## Repository structure

```text
.
├── README.md
├── ai-mock-interview/        # React frontend
│   ├── src/                  # App pages, components, services, and contexts
│   ├── package.json
│   ├── .env.example
│   └── vite.config.ts
├── backend/                 # Django backend
│   ├── authentication/       # Clerk auth middleware and related logic
│   ├── config/               # Django settings, URLs, and ASGI/WSGI config
│   ├── interviews/           # Interview models, views, serializers, and AI logic
│   ├── docker-compose.yml    # Local PostgreSQL setup
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   └── media/                # Recorded interviews and warning screenshots
├── .gitignore
└── .vscode/                  # Optional editor settings
```

## Features

### Frontend

- Marketing landing page and application shell
- Clerk-powered sign-in and sign-up
- Protected routes for authenticated users
- Candidate dashboard with interview history
- Interview configuration form for experience and stack selection
- Permission flow for camera and microphone access
- Live interview screen with question rendering and answer capture
- Final interview report and summary view
- Browser-side monitoring for eye movement, lip movement, and smart-device detection

### Backend

- Django REST API with DRF
- Clerk JWT authentication for protected endpoints
- PostgreSQL local development configuration via Docker Compose
- AI-generated technical interview questions
- Interview answer evaluation using Groq-backed scoring
- Persistence of interview/answer history and feedback
- Warning event logging for suspicious user activity
- Media upload support for recordings and screenshots

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 20+ and npm
- Python 3.12+
- Docker Desktop with Docker Compose
- Clerk account and publishable/secret keys
- Groq API key

## Local development setup

### 1. Start PostgreSQL

From the repository root:

```powershell
cd backend
docker compose up -d postgres
```

This project uses PostgreSQL on `localhost:5434` for development.

### 2. Configure backend environment

Create a `backend/.env` file using the example structure below:

```dotenv
SECRET_KEY=replace-with-a-django-secret-key
DB_NAME=mock_interview
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=localhost
DB_PORT=5434
CLERK_SECRET_KEY=your-clerk-secret-key
CLERK_JWT_KEY=your-clerk-jwt-key
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=openai/gpt-oss-120b
```

Then install the Python dependencies and run database migrations:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at:

- `http://127.0.0.1:8000`

### 3. Configure frontend environment

Create an `ai-mock-interview/.env` file with your Clerk publishable key:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

Then install the frontend dependencies and start the dev server:

```powershell
cd ai-mock-interview
npm install
npm run dev
```

Open the dev server URL shown in the terminal, usually:

- `http://localhost:5173`

## API overview

The backend exposes the following interview-related endpoints. All of them require authentication via Clerk-issued tokens.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/interviews/` | Retrieve the authenticated user's interview history |
| `POST` | `/api/interviews/start/` | Create a new interview and generate questions |
| `POST` | `/api/interviews/<interview_id>/answer/` | Submit and evaluate an answer |
| `POST` | `/api/interviews/<interview_id>/warning/` | Save a monitoring warning event |
| `POST` | `/api/interviews/<interview_id>/terminate/` | Mark the interview as terminated |
| `POST` | `/api/interviews/<interview_id>/recording/` | Upload a completed interview recording |

## Development commands

### Frontend

```powershell
cd ai-mock-interview
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```powershell
cd backend
python manage.py check
python manage.py test
```

## Notes

- This is a local-development MVP and not a production deployment.
- Keep all secrets in local `.env` files and do not commit them to source control.
- The project is structured to evolve into a broader interview platform with stronger evaluation, reporting, monitoring, and operational tooling.

## License

No license has been added to this repository yet. Until a license is added, all rights are reserved by the project owner.
