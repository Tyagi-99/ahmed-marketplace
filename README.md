# Ahmed Marketplace (MercurJS)

Multi-vendor marketplace built on [MercurJS](https://docs.mercurjs.com) and [MedusaJS v2](https://medusajs.com).

## Docker Setup (Recommended)

The project runs as a full Docker Compose stack. Earlier versions used a single container with `network_mode: host` and expected PostgreSQL/Redis on the host machine. The current setup runs **all services in Docker** with proper networking.

### Architecture

```
┌──────────────┐  ┌──────────────┐  ┌──────────────────┐
│ mercur-admin │  │ mercur-seller│  │ mercur-storefront│
│   Vite :7000 │  │   Vite :7001 │  │     Vite :8000   │
└──────┬───────┘  └──────┬───────┘  └────────┬─────────┘
       │                 │                    │
       └────────┬────────┘                    │
                │ vite proxy                  │ API proxy
         ┌──────▼──────┐               ┌──────▼──────┐
         │  mercur-api │◄──────────────│  /energy    │
         │    :9000    │               │  /store     │
         └──────┬──────┘               └─────────────┘
                │
       ┌────────┴────────┐
┌──────▼──────┐  ┌───────▼──────┐
│mercur-postgres│ │ mercur-redis │
│    :5432     │  │    :6379     │
└─────────────┘  └──────────────┘
```

### Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/) (v24+)
- [Docker Compose](https://docs.docker.com/compose/install/) v2
- Git
- Free host ports: **7000**, **7001**, **8000**, **9000**
- Optional (host DB tools): **5433** (Postgres), **6389** (Redis)

### Step 1 — Clone the repository

```bash
git clone https://github.com/Tyagi-99/ahmed-marketplace.git
cd ahmed-marketplace
```

### Step 2 — Build and start all services

```bash
docker compose up --build -d
```

First build takes several minutes (downloads images, runs `yarn install`).

### Step 3 — Wait for the API to be ready

```bash
docker compose logs -f api
```

Look for: `Server is ready on port: 9000` (usually 30–60 seconds).

Press `Ctrl+C` to stop following logs.

### Step 4 — Verify all containers are running

```bash
docker compose ps
```

You should see 6 containers: `mercur-postgres`, `mercur-redis`, `mercur-api`, `mercur-admin`, `mercur-seller`, `mercur-storefront`.

### Step 5 — Open the applications

| Service | URL | Description |
|---|---|---|
| **Storefront** | http://localhost:8000 | Customer-facing shop |
| **Admin** | http://localhost:7000/dashboard | Operator dashboard |
| **Seller** | http://localhost:7001/seller | Vendor portal |
| **API** | http://localhost:9000 | Medusa REST API |
| **API health** | http://localhost:9000/health | Health check |
| Admin (via API) | http://localhost:9000/dashboard | Proxied admin UI |
| Seller (via API) | http://localhost:9000/seller | Proxied seller UI |

Follow on-screen instructions to create your first admin user.

### Docker commands reference

```bash
# Start (detached)
docker compose up -d

# Rebuild after code changes
docker compose up --build -d

# View logs for a service
docker compose logs -f api
docker compose logs -f admin

# Stop all services
docker compose down

# Stop and delete database volume (fresh DB)
docker compose down -v

# Check container status
docker compose ps
```

### Environment variables (Docker)

Docker does **not** use `packages/api/.env` (it is gitignored). All config is in `docker-compose.yml` under `x-app-env`:

| Variable | Value (Docker) |
|---|---|
| `DATABASE_URL` | `postgres://postgres:postgres@postgres:5432/mercur` |
| `REDIS_URL` | `redis://redis:6379` |
| `JWT_SECRET` | `supersecret` (change in production) |
| `COOKIE_SECRET` | `supersecret` (change in production) |
| `ADMIN_VITE_HOST` | `admin` (API → admin container) |
| `VENDOR_VITE_HOST` | `seller` (API → seller container) |
| `VITE_API_PROXY_TARGET` | `http://api:9000` (storefront → API) |

Host port mappings (for external tools only):

| Container | Host port | Internal port |
|---|---|---|
| Postgres | 5433 | 5432 |
| Redis | 6389 | 6379 |

### Troubleshooting

**"Dashboard not built" at http://localhost:9000/dashboard**

Admin and seller Vite containers are not running. Check:

```bash
docker compose ps
docker compose logs admin
docker compose logs seller
```

**Port 9000 already in use**

An old `mercur-app` container may still be running:

```bash
docker stop mercur-app && docker rm mercur-app
docker compose up -d
```

**Database connection errors on startup**

Postgres may still be initializing. Wait until healthy:

```bash
docker compose ps   # mercur-postgres should show (healthy)
```

**API shows `redisUrl not found`**

Ensure you are on the latest `main` branch — `medusa-config.ts` must include `redisUrl: process.env.REDIS_URL`.

---

## Local Development (without Docker)

For native development with hot reload across all apps:

### Prerequisites

- Node.js 20+
- Yarn 4 (via Corepack) or Bun
- PostgreSQL 16 and Redis 7 running locally

### Setup

1. Clone the repo (see above).

2. Copy environment variables:

```bash
cp packages/api/.env.template packages/api/.env
```

3. Edit `packages/api/.env`:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/mercur
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
COOKIE_SECRET=your-super-secret-cookie-key
```

4. Install dependencies and start:

```bash
yarn install
yarn dev
```

5. Open:

- http://localhost:9000 — API
- http://localhost:7000/dashboard — Admin
- http://localhost:7001/seller — Seller
- http://localhost:8000 — Storefront

---

## What's Inside

### Apps and Packages

- `packages/api` — Medusa backend with marketplace functionality
- `apps/admin` — Admin dashboard (Vite + MercurJS)
- `apps/vendor` — Vendor/seller portal (Vite + MercurJS)
- `apps/storefront` — Customer storefront (Vite + React)

### Project Structure

```
├── apps/
│   ├── admin/          # Admin dashboard
│   ├── vendor/         # Seller portal
│   └── storefront/     # Customer storefront
├── packages/
│   └── api/            # Medusa backend
│       ├── src/
│       │   ├── api/         # Custom API routes
│       │   ├── jobs/        # Background jobs
│       │   ├── links/       # Module links
│       │   ├── modules/     # Custom modules
│       │   ├── scripts/     # CLI scripts
│       │   ├── subscribers/ # Event subscribers
│       │   └── workflows/   # Business workflows
│       └── medusa-config.ts
├── Dockerfile          # Shared image for all app services
├── docker-compose.yml  # Full stack: postgres, redis, api, admin, seller, storefront
├── blocks.json
├── package.json
└── turbo.json
```

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Turborepo](https://turborepo.dev/) for monorepo management
- [Prettier](https://prettier.io) for code formatting

## How It Works

Built on [Medusa](https://medusajs.com) with pre-configured marketplace functionality via [MercurJS](https://docs.mercurjs.com).

- **Modules** — data models and business logic
- **Workflows** — multi-step business processes
- **API Routes** — HTTP endpoints for admin, vendor, and storefront
- **Links** — relationships between modules

## Adding Blocks

```bash
bunx @mercurjs/cli add block-name
```

Configure block sources in `blocks.json`:

```json
{
  "aliases": {
    "workflows": "packages/api/src/workflows",
    "links": "packages/api/src/links",
    "api": "packages/api/src/api",
    "modules": "packages/api/src/modules"
  },
  "registries": {}
}
```

## Build

```bash
yarn run build
```

## Questions

[GitHub Discussions](https://github.com/mercurjs/mercur/discussions) | [Mercur Docs](https://docs.mercurjs.com)