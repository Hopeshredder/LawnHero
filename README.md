# LawnHero

Full‑stack lawn‑care assistant that helps homeowners manage yards, schedule tasks, and receive AI‑generated maintenance tips.

## ✨ Features
- **User accounts** – custom Django user model with cookie‑based auth.
- **Yard management** – create yards, group them, and store location/soil/grass details.
- **Preferences** – configure watering, mowing, and fertilizing intervals per yard.
- **Task tracking** – schedule, edit, and complete yard tasks with due/complete summaries.
- **SuperTips** – OpenAI‑powered year‑round care recommendations tailored to each yard.
- **Interactive map** – draw yard boundaries via Leaflet & Turf.js.
- **Responsive UI** – built with React, Vite, Material UI, and TailwindCSS.
- **Testing** – pytest for the backend and Cypress end‑to‑end tests for the frontend.

## 🗂 Project Structure
```
LawnHero/
├── backend/                 # Django REST API
│   ├── users_app/                # Auth & user endpoints
│   ├── yard_app/                 # Yards & yard groups
│   ├── yard_preferences_app/     # Watering/mowing preferences
│   ├── task_app/                 # Scheduled tasks
│   └── supertips_app/            # OpenAI recommendation engine
└── frontend/                # React SPA
    └── src/                  # Components, pages, API helpers
```

## 🛠 Tech Stack
**Backend:** Python 3.12+, Django, Django REST Framework, PostgreSQL, OpenAI API  
**Frontend:** React 19, Vite, React Router, Material UI, TailwindCSS, Leaflet  
**Testing:** pytest, pytest‑django, Cypress

## 🚀 Getting Started

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm
- PostgreSQL running locally
- OpenAI API key

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# .env file (example)
DJANGO_SECRET_KEY=your_secret
OPENAI_API_KEY=your_openai_key
# PostgreSQL settings, CORS_ALLOWED_ORIGINS, etc.

python manage.py migrate
python manage.py createsuperuser   # optional
python manage.py runserver         # http://127.0.0.1:8000
```

### Frontend Setup
```bash
cd frontend
npm install

# Optional: override API URL
# echo "VITE_BASE_URL=http://localhost:8000/api/v1/" > .env

npm run dev                        # http://localhost:5173
```

## ✅ Running Tests
```bash
# Backend unit tests
cd backend
pytest

# Frontend E2E tests (requires backend and preview server)
cd frontend
npm run test        # headless
npm run cy:open     # interactive
```

## 🔑 Environment Variables

| Variable             | Purpose                                                  |
|----------------------|----------------------------------------------------------|
| `DJANGO_SECRET_KEY`  | Django secret key                                        |
| `OPENAI_API_KEY`     | Enables SuperTips generation via OpenAI                  |
| `CORS_ALLOWED_ORIGINS` | Comma‑separated list of allowed origins (default `http://127.0.0.1:5173`) |
| `VITE_BASE_URL`      | Optional override for frontend API base URL             |

## 👥 Contributors
- Alex  
- Nick  
- Marshall  
- Carlos  
- Jay  

## 📄 License
No license specified. Contact the authors for reuse permissions.