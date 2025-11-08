# 🎮 Player Ranking App

Fullstack application for displaying daily player rankings.

## 🧱 Stack

- Backend: NestJS + TypeORM + SQLite
- Frontend: React + Vite
- Tests: Vitest
- Style: CSS
- Documentation: Swagger

## 🚀 Getting Started

### 0️⃣ pnpm Installation

```bash
# Global pnpm installation (if not already installed)
npm install -g pnpm

# Or using corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

### 1️⃣ Install Dependencies

```bash
# From project root (will install dependencies for all workspaces)
pnpm install

# Or use the script:
pnpm run install:all
```

### 2️⃣ Data Seeder

```bash
# From project root
pnpm run seed

# Or directly from backend folder
cd backend
pnpm run seed
```

The seeder generates random data for 100 players over the last 365 days.

### 3️⃣ Start Backend

```bash
# From project root
pnpm run start:backend

# Or directly from backend folder
cd backend
pnpm run start:dev
```

Backend application runs on: `http://localhost:3000`

Swagger: `http://localhost:3000/api/docs`

### 4️⃣ Start Frontend

```bash
# From project root
pnpm run start:frontend

# Or directly from frontend folder
cd frontend
pnpm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 📡 API Endpoints

| Endpoint | Description | Parameters |
|-----------|------|------------|
| `GET /ranking?date=YYYY-MM-DD` | Top 50 players ranking by experience | `date` (optional) |
| `GET /player/ranking/:login?days=356` | Player history | `login`, `days` (optional) |

---

## 🧪 Tests

```bash
# From project root - all tests
pnpm run test:backend
pnpm run test:frontend

# Or directly from folders
cd backend
pnpm run test

cd frontend
pnpm run test
```

Tests follow the Given / When / Then structure.

---

## 🧰 Project Structure

```
project/
├── backend/
│    ├── src/
│    │    ├── main.ts
│    │    ├── app.module.ts
│    │    ├── players/
│    │    │    ├── domain/
│    │    │    │    ├── player.entity.ts
│    │    │    │    ├── player.service.ts
│    │    │    │    ├── player.service.spec.ts
│    │    │    ├── players.controller.ts
│    │    │    ├── players.controller.spec.ts
│    │    │    ├── players.module.ts
│    │    ├── seed/
│    │    │    └── seed.ts
│    ├── test/
│    │    └── integration/
│    │         └── players.e2e-spec.ts
│    ├── data/
│    │    └── database.sqlite
│    ├── ormconfig.ts
│    ├── vitest.config.ts
│    ├── .eslintrc.cjs
│    ├── .prettierrc
│    └── package.json
├── frontend/
│    ├── src/
│    │    ├── App.tsx
│    │    ├── main.tsx
│    │    ├── pages/
│    │    │    ├── Ranking.tsx
│    │    │    ├── Ranking.test.tsx
│    │    │    ├── Player.tsx
│    │    │    └── Player.test.tsx
│    │    ├── components/
│    │    │    └── Table.tsx
│    │    ├── types.ts
│    │    └── test/
│    │         └── setup.ts
│    ├── vite.config.ts
│    ├── vitest.config.ts
│    ├── .eslintrc.cjs
│    ├── .prettierrc
│    └── package.json
├── package.json
└── README.md
```

---

## 🧭 Roadmap

- [ ] Add ranking filtering by experience
- [ ] Add user authentication
- [ ] Export ranking to CSV
- [ ] Automatic data import (cron job)

---

## 👨‍💻 Author

Created with ❤️

