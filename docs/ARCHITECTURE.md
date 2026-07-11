# InSight Vault — Architecture

## Backend Architecture

The NestJS backend follows a modular architecture:

```
src/
├── auth/          # Authentication module (register, login, JWT strategy)
├── categories/    # Categories CRUD module
├── insights/      # Insights CRUD module with search
├── seed/          # Database seeding service
├── app.module.ts  # Root module (ConfigModule, TypeORM, feature imports)
└── main.ts        # Bootstrap (ValidationPipe, Swagger, CORS)
```

### Design Decisions

- **Auth**: JWT with Passport.js strategy. Passwords hashed with bcryptjs (10 rounds).
- **Database**: TypeORM with PostgreSQL (Neon). SSL required for Neon connections.
- **Validation**: Global ValidationPipe with whitelist and transform enabled.
- **Swagger**: Auto-generated API docs at `/api/docs`.
- **Scoping**: All resources scoped to authenticated user via `req.user.id`.

## Frontend Architecture

The Angular 22 frontend uses standalone components with signal-based state:

```
src/app/
├── models/          # TypeScript interfaces (Insight, Category, Auth)
├── services/        # ApiService (CRUD), AuthService, AuthInterceptor
├── pages/
│   ├── auth-page/      # Login/Register with tab toggle
│   ├── dashboard/      # Insight list with search and filter
│   ├── insight-form/   # Create/edit insight
│   ├── insight-detail/ # Full insight view
│   └── categories/     # Category management
├── app.ts           # Root component with nav shell
├── app.config.ts    # Providers (zoneless, HTTP, router)
└── app.routes.ts    # Route definitions
```

### Design Decisions

- **Zoneless**: Uses `provideZonelessChangeDetection()` for modern Angular.
- **Signals**: All component state managed with `signal()` and `computed()`.
- **Async/Await**: HTTP calls use `async/await` with `lastValueFrom()`.
- **Relative URLs**: API calls use `/api/` — no hardcoded localhost.
- **Tailwind v4**: Pre-processed via `@tailwindcss/cli` before Angular build.

## Database Schema

### Users
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, AUTOINCREMENT |
| email | VARCHAR | UNIQUE, NOT NULL |
| name | VARCHAR | NOT NULL |
| password | VARCHAR | NOT NULL (bcrypt hash) |
| createdAt | TIMESTAMP | DEFAULT NOW() |

### Categories
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, AUTOINCREMENT |
| name | VARCHAR | NOT NULL |
| description | VARCHAR | NULLABLE |
| userId | INTEGER | FK -> users.id |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| **UNIQUE** | (name, userId) | Composite unique |

### Insights
| Column | Type | Constraints |
|--------|------|------------|
| id | INTEGER | PK, AUTOINCREMENT |
| title | VARCHAR | NOT NULL |
| content | TEXT | NOT NULL |
| categoryId | INTEGER | FK -> categories.id, NULLABLE |
| userId | INTEGER | FK -> users.id |
| tags | VARCHAR | NULLABLE (comma-separated) |
| createdAt | TIMESTAMP | DEFAULT NOW() |
| updatedAt | TIMESTAMP | ON UPDATE NOW() |
