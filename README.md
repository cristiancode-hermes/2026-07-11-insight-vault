# InSight Vault 📝

**Knowledge & Insight Management Platform**

A full-stack web application for capturing, organizing, and searching insights, notes, and knowledge entries. Built with Angular 22 and NestJS 11, powered by Neon PostgreSQL.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 22 (standalone, zoneless, signals, Tailwind CSS v4) |
| **Backend** | NestJS 11 (TypeORM, Passport JWT, Swagger) |
| **Database** | Neon PostgreSQL (serverless) |
| **Auth** | JWT with bcryptjs password hashing |

## Features

- **User Authentication** — Register, login, JWT-based session management
- **Insight Management** — Create, read, update, delete knowledge entries
- **Category Organization** — Group insights by user-defined categories
- **Full-Text Search** — Search insights by title and content
- **Dark Theme UI** — Modern dark interface with Tailwind CSS

## Project Structure

```
2026-07-11-insight-vault/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── src/
│   │   │   ├── auth/           # Auth module (register, login, JWT)
│   │   │   ├── categories/     # Categories CRUD module
│   │   │   ├── insights/       # Insights CRUD module
│   │   │   ├── seed/           # Database seed service
│   │   │   ├── app.module.ts   # Root module
│   │   │   └── main.ts         # Bootstrap entry
│   │   ├── .env                # Environment config
│   │   └── package.json
│   └── web/                    # Angular 22 frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── models/     # TypeScript interfaces
│       │   │   ├── services/   # API, Auth services + interceptor
│       │   │   ├── pages/      # Auth, Dashboard, Insight, Category pages
│       │   │   ├── app.ts      # Root component
│       │   │   └── app.routes.ts
│       │   ├── styles.css      # Tailwind v4 styles with custom theme
│       │   └── main.ts
│       └── package.json
├── docs/                       # Documentation
└── README.md
```

## Quick Start

### Prerequisites
- Node.js 22+
- npm 10+

### 1. Backend Setup

```bash
cd apps/api
cp .env.example .env   # Edit with your Neon DB URL
npm install
npm run build
SEED_DB=true npm run start:dev   # Seeds sample data
```

### 2. Frontend Setup

```bash
cd apps/web
npm install
npm run start          # Starts on http://localhost:4200
```

### 3. Access the App

- **Frontend**: http://localhost:4200
- **API**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api/docs

### Demo Credentials

- Email: `demo@insightvault.com`
- Password: `demo123456`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/profile` | Yes | Get current user |
| GET | `/api/categories` | Yes | List user's categories |
| POST | `/api/categories` | Yes | Create category |
| GET | `/api/categories/:id` | Yes | Get category by ID |
| PUT | `/api/categories/:id` | Yes | Update category |
| DELETE | `/api/categories/:id` | Yes | Delete category |
| GET | `/api/insights` | Yes | List insights (supports `?search=`) |
| POST | `/api/insights` | Yes | Create insight |
| GET | `/api/insights/:id` | Yes | Get insight by ID |
| PUT | `/api/insights/:id` | Yes | Update insight |
| DELETE | `/api/insights/:id` | Yes | Delete insight |

## Build for Production

```bash
# Backend
cd apps/api && npm run build

# Frontend (with Tailwind pre-processing)
cd apps/web && npm run build
```
