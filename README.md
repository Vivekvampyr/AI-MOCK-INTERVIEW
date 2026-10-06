# AI Mock Interview

An AI-powered mock interview application for practicing technical interviews. Candidates can sign in, choose their experience level and technologies, and start an interview with generated questions.

> **Project status: In progress (approximately 30–40% complete).** This is an active development project, not a finished or production-ready application. Features, setup steps, and APIs may change.

## Current progress

### Implemented or partially implemented

- React and TypeScript frontend with landing, sign-in, sign-up, dashboard, interview setup, device-permission, and interview screens.
- Clerk sign-in integration and protected frontend routes.
- Django REST API with Clerk token authentication.
- PostgreSQL configuration and a Docker Compose service for local development.
- Interview setup and question generation using the Groq API.
- Backend storage models for interviews, questions, answers, scoring, feedback, and monitoring warning events.
- Camera and microphone permission checks and a live camera preview.
- API endpoint to save an answer.

### Still in development

- The interview screen currently advances through questions locally; answer submission is not yet connected to the save-answer API.
- Recording, interview monitoring/detection, scoring, and AI feedback are not fully implemented.
- Dashboard interview history and score cards are placeholders.
- Error handling, testing, and production configuration need further work.

## Tech stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, Clerk
- **Backend:** Python, Django, Django REST Framework
- **Database:** PostgreSQL
- **AI question generation:** Groq API
- **Authentication:** Clerk

## Repository structure

```text
.
├── ai-mock-interview/    # React + TypeScript frontend
└── backend/              # Django REST API and PostgreSQL Compose file
```

## Getting started

These instructions are for local development on Windows. You will need Node.js/npm, Python, Docker with Compose, and accounts/keys for Clerk and Groq. Unless noted otherwise, run the setup commands from the repository root.

### 1. Start PostgreSQL

```powershell
cd backend
docker compose up -d postgres
```

The included Compose configuration exposes PostgreSQL on `localhost:5434` and uses development-only credentials. Do not use these credentials for a deployed environment.

### 2. Configure the backend

Create `backend/.env` with your own values:

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

Keep secret keys private and do not commit `.env` files. `GROQ_MODEL` is optional; the backend defaults to `openai/gpt-oss-120b`.

Install dependencies and run database migrations:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

### 3. Configure and start the frontend

Create `ai-mock-interview/.env` and add your Clerk publishable key:

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

In a separate terminal:

```powershell
cd ai-mock-interview
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). The backend currently allows this origin for CORS and the frontend API service targets `http://127.0.0.1:8000/api`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/interviews/start/` | Create an interview and generate questions |
| `POST` | `/api/interviews/<interview_id>/answer/` | Save an answer for a question |

Both endpoints require a valid Clerk session token.

## Development scripts

Run these from `ai-mock-interview/`:

```powershell
npm run dev       # Start the Vite development server
npm run build     # Type-check and build the frontend
npm run lint      # Lint the frontend
npm run preview   # Preview the production build locally
```

Run backend checks from `backend/`:

```powershell
python manage.py check
python manage.py test
```

## Contributing

Contributions, bug reports, and suggestions are welcome. Since this project is under active development, please open an issue or discussion before making large changes so the scope can be aligned.

## License

No license has been added yet. Until one is included, all rights are reserved by the project owner.