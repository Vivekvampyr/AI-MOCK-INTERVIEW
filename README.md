# AI Mock Interview

An AI-powered mock interview platform for practicing technical interviews. It combines a React frontend with a Django backend to generate interview questions, capture candidate responses, evaluate answers with AI, and track common interview integrity signals such as eye movement, lip movement, and device-use warnings.

> Project status: approximately 60–70% complete.
>
> The core product flow is implemented as a functional MVP, but the project is still under active development and not yet production-ready. Several flows are in progress or require polishing before a stable release.

## What is already implemented

### Frontend

- Landing page and marketing-style product overview
- Sign-in and sign-up flows powered by Clerk
- Protected authenticated routes
- Candidate dashboard flow
- Interview setup form for experience level and tech stack selection
- Camera and microphone permission flow
- Live interview screen with question rendering and answer capture
- Final interview report page and result summary flow
- Browser-side monitoring for eye movement, lip movement, and smart-device detection

### Backend

- Django REST API with DRF
- Clerk-based API authentication middleware
- PostgreSQL configuration for local development with Docker Compose
- Interview creation and AI question generation with Groq
- Interview answer persistence and scoring evaluation
- Interview history retrieval for authenticated users
- Warning event logging for suspicious interview behavior
- Database models for interviews, questions, scores, feedback, and warnings

### Product flow

- Candidate signs in
- Selects experience level and technologies
- Starts an interview with AI-generated technical questions
- Answers questions in a timed session
- Monitoring checks run during the session
- Answers are saved and evaluated
- Final status and summary are produced

## Current focus and remaining work

The project is beyond the initial prototype stage, but several areas still need completion before release:

- Finalize the full interview completion flow and end-to-end transitions
- Improve dashboard history and reporting polish
- Refine AI evaluation quality and feedback consistency
- Stabilize monitoring detection thresholds and warning logging
- Improve error handling, validation, and edge-case coverage
- Add broader testing and deployment configuration
- Harden production security settings before public launch

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Router
- Authentication: Clerk
- Backend: Python, Django, Django REST Framework
- Database: PostgreSQL
- AI generation and evaluation: Groq API
- Media monitoring: TensorFlow.js, MediaPipe, browser webcam APIs

## Repository structure

```text
.
├── README.md
├── ai-mock-interview/      # React + TypeScript frontend
│   ├── src/                # App pages, UI, services, hooks, and context
│   ├── package.json
│   └── .env.example
├── backend/                # Django API and PostgreSQL configuration
│   ├── authentication/     # Clerk auth integration
│   ├── config/             # Django settings and URLs
│   ├── interviews/         # Interview models, serializers, views, and AI logic
│   ├── docker-compose.yml  # PostgreSQL local setup
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
└── .gitignore
```

## Local development setup

These instructions are for local development on Windows. You will need Node.js/npm, Python, Docker with Compose, and valid Clerk and Groq credentials.

### 1. Start PostgreSQL

From the repository root:

```powershell
cd backend
docker compose up -d postgres
```

This project uses PostgreSQL at `localhost:5434` for local development. The included credentials are for development only and should not be used in production.

### 2. Configure backend environment

Create `backend/.env` based on the example values:

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

Then install dependencies and run migrations:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs by default at `http://127.0.0.1:8000`.

### 3. Configure frontend environment

Create `ai-mock-interview/.env` with your Clerk publishable key:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

Then start the frontend in a separate terminal:

```powershell
cd ai-mock-interview
npm install
npm run dev
```

Open the Vite URL shown in the terminal (typically `http://localhost:5173`).

## API overview

The backend exposes interview-related endpoints for authenticated users.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/interviews/start/` | Create a new interview and generate questions |
| `GET` | `/api/interviews/` | Get the authenticated user's interviews |
| `POST` | `/api/interviews/<interview_id>/answer/` | Save and evaluate a candidate answer |
| `POST` | `/api/interviews/<interview_id>/warning/` | Save a monitoring warning event |

Authentication is required for all endpoints via Clerk-issued tokens.

## Development commands

Frontend commands:

```powershell
cd ai-mock-interview
npm run dev
npm run build
npm run lint
npm run preview
```

Backend commands:

```powershell
cd backend
python manage.py check
python manage.py test
```

## Notes

- This is a local-development MVP and not yet a production deployment.
- Use `.env` files only for local configuration and keep secrets private.
- The project is structured to evolve toward a full interview platform with stronger monitoring, scoring, reporting, and operational tooling.

## License

No license has been added to the repository yet. Until a license is added, all rights are reserved by the project owner.