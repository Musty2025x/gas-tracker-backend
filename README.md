# ⛽ GasTracker Backend

> LPG Station Management System — NestJS + PostgreSQL + Docker

[![NestJS](https://img.shields.io/badge/NestJS-v10-red)](https://nestjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)](https://docker.com)

---

## 🚀 Quick Start (Local)

```bash
git clone https://gitlab.com/musty2025x/gas-tracker-backend.git
cd gas-tracker-backend
cp .env.example .env          # Edit with your values
docker-compose up -d          # Start all 4 containers
```

API:      http://localhost:3000/api/v1
Swagger:  http://localhost:3000/api/docs

---

## 🏗️ Architecture

```
src/
├── auth/           JWT authentication (register, login)
├── users/          Staff management (CRUD, roles)
├── stations/       Gas station management
├── entries/        Daily meter readings + variance
├── stock/          Gas delivery tracking
├── expenses/       Station expense recording
├── reports/        Daily and weekly report aggregation
└── common/         Guards, decorators, filters
```

## 🐳 Docker Services

| Container         | Image                  | Port        |
|-------------------|------------------------|-------------|
| gastracker-api    | gas-tracker-backend-api| 3000        |
| gastracker-db     | postgres:15-alpine     | 5432        |
| gastracker-redis  | redis:7-alpine         | 6379        |
| gastracker-nginx  | nginx:alpine           | 80 / 443    |

## 👤 User Roles

| Role        | Permissions                              |
|-------------|------------------------------------------|
| owner       | Full access — manages station and staff  |
| manager     | Read/write all station data              |
| attendant   | Submit daily meter entries only          |
| super_admin | Platform-wide admin (GasTracker team)    |

## 📡 API Endpoints

### Auth
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Staff
- `GET    /api/v1/staff/station/:id`
- `POST   /api/v1/staff`
- `PUT    /api/v1/staff/:id/toggle-active`
- `PUT    /api/v1/staff/:id/reset-password`
- `DELETE /api/v1/staff/:id`

### Stations
- `POST /api/v1/stations`
- `GET  /api/v1/stations/my-stations`
- `PUT  /api/v1/stations/:id/price`

### Entries
- `POST /api/v1/entries`
- `POST /api/v1/entries/sync`  (offline bulk sync)
- `GET  /api/v1/entries/station/:id?from=&to=`
- `GET  /api/v1/entries/station/:id/summary?date=`

### Stock / Expenses / Reports
- Full CRUD — see Swagger docs

## 🔒 Security
- JWT authentication on all routes except /auth
- Role-based access control (RBAC)
- bcrypt password hashing (12 rounds)
- CORS configured via FRONTEND_URL env var

## 📦 Deploy to Production VPS

See **GasTracker-Deployment-Guide.docx** for the full step-by-step guide.

```bash
# On your Contabo VPS
git clone <repo> && cd gas-tracker-backend
cp .env.example .env && nano .env
docker-compose build --no-cache
docker-compose up -d
```

---

Built by **Ajibola Sodiq** · GasTracker © 2026
