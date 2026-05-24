# ⛽ GasTracker Backend API

LPG Station Management System — NestJS + PostgreSQL + Docker

---

## 🏗️ Architecture

```
src/
├── auth/           # JWT authentication, register, login
├── users/          # User entity (owner, manager, attendant roles)
├── stations/       # Gas station CRUD, price management
├── entries/        # Daily meter readings + cash/POS remittance
├── stock/          # Gas delivery and stock movement tracking
├── expenses/       # Station expense recording
├── reports/        # Daily and weekly aggregated reports
├── common/
│   ├── guards/     # JWT auth guard, roles guard
│   ├── decorators/ # @CurrentUser(), @Roles()
│   └── filters/
└── config/         # Database config
```

## 🚀 Quick Start (Local Dev)

### Prerequisites
- Docker + Docker Compose
- Node.js 20+

### 1. Clone and configure
```bash
git clone <your-repo>
cd gas-tracker-backend
cp .env.example .env
# Edit .env with your values
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

API runs at: `http://localhost:3000/api/v1`  
Swagger docs: `http://localhost:3000/api/docs`

### 3. Run locally (without Docker)
```bash
npm install
npm run start:dev
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register user |
| POST | `/api/v1/auth/login` | Login, get JWT token |

### Stations
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/stations` | Create station |
| GET | `/api/v1/stations/my-stations` | Owner's stations |
| PUT | `/api/v1/stations/:id/price` | Update gas price |

### Entries (Daily Meter)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/entries` | Submit daily entry |
| POST | `/api/v1/entries/sync` | Bulk sync offline entries |
| GET | `/api/v1/entries/station/:id?from=&to=` | Get entries by date range |
| GET | `/api/v1/entries/station/:id/summary?date=` | Daily summary |

### Stock
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/stock/delivery` | Record gas delivery |
| GET | `/api/v1/stock/station/:id` | Stock movements |
| GET | `/api/v1/stock/station/:id/current` | Current stock level |

### Expenses
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/expenses` | Record expense |
| GET | `/api/v1/expenses/station/:id` | Station expenses |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/station/:id/daily?date=` | Daily report |
| GET | `/api/v1/reports/station/:id/weekly?from=&to=` | Weekly report |

---

## 👤 User Roles

| Role | Access |
|------|--------|
| `owner` | All stations they own, full read/write |
| `manager` | Assigned station, all data |
| `attendant` | Assigned station, entries only |
| `super_admin` | Platform-wide (GasTracker admin) |

---

## 🐳 Production Deployment (Contabo VPS)

```bash
# On your VPS
git clone <repo>
cd gas-tracker-backend

# Set production env
cp .env.example .env
nano .env  # Set strong passwords, JWT secret, etc.

# Build and run
docker-compose up -d --build

# Check logs
docker-compose logs -f api
```

---

## 🔒 Security Checklist (Before Going Live)
- [ ] Change `JWT_SECRET` to a long random string
- [ ] Change all default DB passwords
- [ ] Enable HTTPS via Certbot/Let's Encrypt
- [ ] Set `NODE_ENV=production`
- [ ] Enable Nginx rate limiting
- [ ] Set up daily PostgreSQL backups

---

## 📱 Mobile App
The React Native (Expo) mobile app lives in `../gas-tracker-mobile`

**Offline sync flow:**
1. Mobile stores entries in SQLite when offline
2. On reconnect, calls `POST /api/v1/entries/sync` with all pending entries
3. Server deduplicates by `localId` field
