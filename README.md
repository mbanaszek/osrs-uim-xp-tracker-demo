# 🎮 Player Ranking App

Fullstack application for displaying daily player rankings.

## 🧱 Stack

- Backend: NestJS + TypeORM + SQLite
- Frontend: React + Vite
- Tests: Vitest
- Style: CSS
- Documentation: Swagger

## 🚀 Getting Started

### 0️⃣ Node.js Installation (using asdf - recommended)

```bash
# Install asdf (if not already installed)
# macOS
brew install asdf

# Linux
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.14.0

# Add asdf to your shell (add to ~/.zshrc or ~/.bashrc)
echo -e "\n. $(brew --prefix asdf)/libexec/asdf.sh" >> ~/.zshrc
# Or for Linux:
# echo -e "\n. $HOME/.asdf/asdf.sh" >> ~/.zshrc

# Install asdf-nodejs plugin
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git

# Install Node.js (check required version in project)
asdf install nodejs latest
asdf global nodejs latest

# Verify installation
node --version
npm --version
```

### 1️⃣ pnpm Installation

```bash
# Global pnpm installation (if not already installed)
npm install -g pnpm

# Or using corepack (Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate
```

### 2️⃣ Install Dependencies

```bash
# From project root (will install dependencies for all workspaces)
pnpm install

# Or use the script:
pnpm run install:all
```

### 2️⃣.5️⃣ SQLite3 Installation (Native Module)

**Important:** SQLite3 is a native module that requires compilation. pnpm by default blocks build scripts for security reasons.

If you encounter an error like `DriverPackageNotInstalledError: SQLite`, follow these steps:

```bash
# 1. Approve build scripts for sqlite3
pnpm approve-builds sqlite3
# Select sqlite3 when prompted (press space to select, then enter)

# 2. Reinstall sqlite3 to trigger build
cd backend
pnpm install sqlite3 --force

# 3. Verify sqlite3 installation
node -e "require('sqlite3'); console.log('✅ sqlite3 OK');"
```

**Note:** The project is already configured with:
- `onlyBuiltDependencies: ["sqlite3"]` in root `package.json`
- `enable-pre-post-scripts=true` in `backend/.npmrc`

If you still have issues:

```bash
# Rebuild sqlite3 manually
cd backend
pnpm rebuild sqlite3

# Or reinstall all dependencies
cd ..
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### 3️⃣ Data Seeder

```bash
# From project root
pnpm run seed

# Or directly from backend folder
cd backend
pnpm run seed
```

The seeder generates random data for 100 players over the last 365 days.

### 4️⃣ Start Backend

```bash
# From project root
pnpm run start:backend

# Or directly from backend folder
cd backend
pnpm run start:dev
```

Backend application runs on: `http://localhost:3000`

Swagger: `http://localhost:3000/api/docs`

### 5️⃣ Start Frontend

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

