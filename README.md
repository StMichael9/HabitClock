# HabitClock

HabitClock is a full-stack habit tracking app where users can:

- Sign up / log in securely
- Create and manage habits
- Organize habits by categories
- Start/stop timed habit sessions
- Set goals for habits

**Live App:** https://habit-clock-xi.vercel.app/

---

## Tech Stack

### Frontend
- Vite
- React

### Backend
- Flask
- Flask-SQLAlchemy
- Flask-Migrate (Alembic)
- Marshmallow
- SQLite (default local DB)
- Gunicorn (for production deployment)

---

## Project Structure

```text
HabitClock/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── auth.py
│   │   ├── habit_routes.py
│   │   ├── session_routes.py
│   │   ├── category_routes.py
│   │   └── goal_routes.py
│   └── migrations/
└── frontend/
```

---

## Local Development Setup

## 1) Clone the repository

```bash
git clone https://github.com/StMichael9/HabitClock.git
cd HabitClock
```

## 2) Backend Setup

### Create and activate virtual environment

> Windows (PowerShell/CMD):
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
```

> macOS/Linux:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

### Install dependencies

```bash
pip install -r requirements.txt
```

### Run database migrations

If this is your first run, initialize the DB schema from migrations:

```bash
flask db upgrade
```

### (Optional) Seed preset categories

```bash
python seed.py
```

This inserts global categories (not tied to a user), such as:
- Work
- Health
- Productivity
- Fitness
- Learning
- Personal

### Start backend server

```bash
flask run
```

Backend will typically run at:
- `http://127.0.0.1:5000`

---

## 3) Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will typically run at:
- `http://localhost:5173`

---

## Environment Variables

Backend config is in `backend/app.py`.

Supported variables:

- `DATABASE_URL`  
  Default: `sqlite:///habitclock.db`
- `SECRET_KEY`  
  Default fallback is set in code, but you should provide your own in production.

Example (PowerShell):
```powershell
$env:DATABASE_URL="sqlite:///habitclock.db"
$env:SECRET_KEY="replace-with-a-secure-random-value"
flask run
```

Example (macOS/Linux):
```bash
export DATABASE_URL="sqlite:///habitclock.db"
export SECRET_KEY="replace-with-a-secure-random-value"
flask run
```

---

## Authentication & Session Notes

The backend uses Flask session cookies for auth.

Cookie/security config includes:

- `SESSION_COOKIE_SAMESITE = "None"`
- `SESSION_COOKIE_SECURE = True`
- `SESSION_COOKIE_HTTPONLY = True`

For local HTTP development, `SESSION_COOKIE_SECURE=True` may prevent cookies from being sent unless you're on HTTPS.  
If you run into login/session issues locally, consider using a local-dev config that sets `SESSION_COOKIE_SECURE=False`.

---

## CORS Configuration

Configured backend origins:

- `https://habit-clock-xi.vercel.app`
- `http://localhost:5173`

If your frontend runs on a different origin, update CORS in `backend/app.py`.

---

## API Overview

Base URL (local): `http://127.0.0.1:5000`

## Auth Routes (`/`)

- `POST /signup` — create account
- `POST /login` — log in
- `DELETE /logout` — log out
- `GET /check_session` — check current logged-in user

## Habit Routes (`/habits`)

- `GET /habits/` — list user habits
- `GET /habits/<id>` — get one habit
- `POST /habits/` — create habit
- `PATCH /habits/<id>` — update habit
- `DELETE /habits/<id>` — delete habit

## Session Routes (`/sessions`)

- `GET /sessions/<habit_id>` — list sessions for habit
- `POST /sessions/<habit_id>/start` — start timer/session
- `POST /sessions/<habit_id>/stop` — stop active timer/session
- `DELETE /sessions/<session_id>` — delete session record

## Category Routes (`/categories`)

- `GET /categories/` — list categories (user + global preset categories)
- `GET /categories/<id>` — get one category
- `POST /categories/` — create category
- `PATCH /categories/<id>` — update category
- `DELETE /categories/<id>` — delete category

## Goal Routes (`/goals`)

- `GET /goals/` — list goals
- `GET /goals/<id>` — get one goal
- `POST /goals/` — create goal
- `PATCH /goals/<id>` — update goal
- `DELETE /goals/<id>` — delete goal

---

## Database & Migrations

This project uses Flask-Migrate/Alembic.

Common commands (run inside `backend/`):

```bash
flask db migrate -m "describe change"
flask db upgrade
flask db downgrade
```

Current migration files live in:
- `backend/migrations/versions/`

---

## Troubleshooting

## 1) `pip install -r requirements.txt` fails on Windows

Your `requirements.txt` appears to contain encoding artifacts.  
If install fails, re-save the file as **UTF-8** and ensure each line is plain text like:

```txt
Flask==3.1.3
Flask-SQLAlchemy==3.1.1
Flask-Migrate==4.1.0
...
gunicorn
```

## 2) `flask` command not found

Make sure:
- Virtual env is activated
- Flask is installed in that env

Then try:
```bash
python -m flask run
```

## 3) Session/login not persisting locally

Because secure cookies are enabled, local HTTP may not store/send cookies.  
For local-only testing, set secure cookies to `False` in a dev config.

## 4) CORS errors in browser

Confirm your frontend origin exactly matches one of allowed CORS origins in `backend/app.py`.

## 5) Migration errors

Try:
```bash
flask db stamp head
flask db upgrade
```
(Only if you understand your current DB state.)

---

## Deployment Notes

- Backend is production-ready with Gunicorn dependency included.
- Ensure `SECRET_KEY` and `DATABASE_URL` are set in deployment environment.
- Keep cookie settings secure (`Secure=True`, `HttpOnly=True`) in production.

---

## License

Add your preferred license here (MIT, Apache-2.0, etc.).

---

## Author

Built by [@StMichael9](https://github.com/StMichael9)
