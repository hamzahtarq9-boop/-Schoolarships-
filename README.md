# Tawjihi Scholarships Platform

A full-stack scholarship platform for Palestinian students (Palestine + diaspora).

- **Frontend:** React (Vite) + Tailwind CSS + Framer Motion + Lucide icons, full RTL Arabic support with an EN toggle, glassmorphism + glow design.
- **Backend:** Spring Boot 3 (Java 17) REST API, Spring Security + JWT, JPA/Hibernate, PostgreSQL (H2 for zero-setup local dev).

## Folder structure

```
scholarship-platform/
├── frontend/                  # React app (Vite)
│   ├── src/
│   │   ├── api/client.js      # Axios instance + API calls
│   │   ├── components/        # Navbar, Footer, Cards, GlowBackground, StatsCounter
│   │   ├── context/LangContext.jsx  # RTL/i18n
│   │   ├── hooks/useScholarships.js
│   │   ├── pages/              # Home, Scholarships, ScholarshipDetail, Announcements, About, Contact
│   │   └── pages/admin/        # Login, Dashboard (protected CRUD UI)
│   └── Dockerfile
└── backend/                   # Spring Boot API
    └── src/main/java/pl/tawjihi/scholarships/
        ├── entity/             # Scholarship, Announcement, ContactMessage, AdminUser
        ├── repository/         # Spring Data JPA repos
        ├── service / service/impl
        ├── controller/         # REST controllers
        ├── security/           # JWT filter + service
        ├── config/             # Security, CORS, data seeder
        └── dto/, exception/
```

## Run locally

### 1. Backend (Spring Boot)

Zero-setup mode (in-memory H2, no Postgres needed):

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`, seeds a default admin account:
- username: `admin`
- password: `ChangeMe123!`

**Change this password (or the seeding logic) before any real deployment.**

To use real PostgreSQL locally instead of H2, install Postgres, create a database `tawjihi`, then run:

```bash
SPRING_PROFILES_ACTIVE=prod \
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/tawjihi \
SPRING_DATASOURCE_USERNAME=postgres \
SPRING_DATASOURCE_PASSWORD=postgres \
mvn spring-boot:run
```

### 2. Frontend (React)

```bash
cd frontend
cp .env.example .env       # adjust VITE_API_BASE_URL if needed
npm install
npm run dev
```

Opens on `http://localhost:5173`. The UI works even before the backend is reachable (it falls back to sample data), so you can preview the design immediately.

## API summary

| Method | Endpoint                    | Auth        |
|--------|------------------------------|-------------|
| GET    | /api/scholarships             | public      |
| GET    | /api/scholarships/{id}        | public      |
| POST   | /api/scholarships              | JWT (admin) |
| PUT    | /api/scholarships/{id}        | JWT (admin) |
| DELETE | /api/scholarships/{id}        | JWT (admin) |
| GET    | /api/announcements              | public      |
| POST   | /api/announcements              | JWT (admin) |
| PUT    | /api/announcements/{id}        | JWT (admin) |
| DELETE | /api/announcements/{id}        | JWT (admin) |
| POST   | /api/contact                    | public      |
| POST   | /api/auth/login                 | public      |

## Deployment (free-tier friendly)

### Frontend → Vercel
1. Push this repo to GitHub.
2. In Vercel: "New Project" → import the repo → set **Root Directory** to `frontend`.
3. Framework preset: Vite. Build command `npm run build`, output `dist` (auto-detected).
4. Add env var `VITE_API_BASE_URL` = your deployed backend URL + `/api` (e.g. `https://your-api.onrender.com/api`).
5. Deploy.

### Backend + PostgreSQL → Render (or Railway)
**Render:**
1. Create a **PostgreSQL** instance on Render — copy its internal connection details.
2. Create a **Web Service** from the same GitHub repo, **Root Directory** `backend`, environment "Docker" (it will use the included `Dockerfile`).
3. Set environment variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://<render-postgres-host>:5432/<db>`
   - `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
   - `JWT_SECRET` — a long random string
   - `CORS_ALLOWED_ORIGINS` — your Vercel URL (e.g. `https://tawjihi-scholarships.vercel.app`)
4. Deploy. Render builds the Dockerfile and exposes the service on the `PORT` it assigns (already wired via `server.port: ${PORT:8080}`).

**Railway** works the same way: provision a Postgres plugin, deploy the `backend` folder as a service (it detects the Dockerfile), and set the same environment variables.

### After first deploy
- Log into `/admin` with the seeded admin account, then rotate the password (there's no self-service "change password" UI yet — update it directly via a DB update with a new BCrypt hash, or extend `AuthController`).
- Start adding real scholarships and announcements from the dashboard.

## Notes & next steps
- The frontend gracefully falls back to sample data if the API is unreachable, so the UI is demoable standalone.
- `ddl-auto: update` auto-creates tables on boot for convenience; for a production-grade setup, swap to Flyway/Liquibase migrations before going live with real user data.
- Image uploads currently take a URL string (`imageUrl`) — wire up S3/Cloudinary if you want direct upload from the admin dashboard.
