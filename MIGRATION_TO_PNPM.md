# 🔄 Migracja z npm na pnpm - Instrukcja krok po kroku

## ✅ Zmiany w projekcie (już wykonane)

1. ✅ Utworzono `pnpm-workspace.yaml` - konfiguracja workspace'ów
2. ✅ Zaktualizowano `package.json` (root) - skrypty zmienione na pnpm
3. ✅ Utworzono `.npmrc` - konfiguracja pnpm
4. ✅ Zaktualizowano `.gitignore` - dodano wpisy dla pnpm
5. ✅ Zaktualizowano `README.md` - komendy zmienione na pnpm

## 📋 Komendy do wykonania w terminalu

### Krok 1: Sprawdź czy istnieją node_modules i package-lock.json

```bash
cd /Users/maciej.banaszek/Projects/DemoProject

# Sprawdź czy istnieją node_modules
ls -la | grep node_modules

# Sprawdź czy istnieją package-lock.json
find . -name "package-lock.json" -type f
```

### Krok 2: Usuń node_modules i package-lock.json (jeśli istnieją)

```bash
# Z root projektu
rm -rf node_modules
rm -f package-lock.json

# Z backend
rm -rf backend/node_modules
rm -f backend/package-lock.json

# Z frontend
rm -rf frontend/node_modules
rm -f frontend/package-lock.json
```

### Krok 3: Zainstaluj pnpm

```bash
# Opcja 1: Używając npm (globalnie)
npm install -g pnpm

# Opcja 2: Używając corepack (zalecane dla Node.js 16.13+)
corepack enable
corepack prepare pnpm@latest --activate

# Sprawdź instalację
pnpm --version
```

### Krok 4: Zainicjalizuj projekt z pnpm

```bash
# Z root projektu
cd /Users/maciej.banaszek/Projects/DemoProject

# Zainstaluj wszystkie zależności (dla wszystkich workspace'ów)
pnpm install
```

### Krok 5: Zweryfikuj instalację

```bash
# Sprawdź czy node_modules zostały utworzone
ls -la node_modules

# Sprawdź czy pnpm-lock.yaml został utworzony
ls -la pnpm-lock.yaml

# Sprawdź workspace'y
pnpm list --depth=0
```

### Krok 6: Przetestuj komendy

```bash
# Test seeder
pnpm run seed

# Test backend (w osobnym terminalu)
pnpm run start:backend

# Test frontend (w osobnym terminalu)
pnpm run start:frontend

# Test testów backend
pnpm run test:backend

# Test testów frontend
pnpm run test:frontend
```

## 🎯 Użyteczne komendy pnpm

### Z root projektu (workspace commands)

```bash
# Instalacja wszystkich zależności
pnpm install

# Uruchomienie backendu
pnpm run start:backend
# lub
pnpm --filter backend start:dev

# Uruchomienie frontendu
pnpm run start:frontend
# lub
pnpm --filter frontend dev

# Uruchomienie seedera
pnpm run seed
# lub
pnpm --filter backend seed

# Testy
pnpm run test:backend
pnpm run test:frontend
```

### Z konkretnego workspace (backend/frontend)

```bash
# Backend
cd backend
pnpm install
pnpm run start:dev
pnpm run test
pnpm run seed

# Frontend
cd frontend
pnpm install
pnpm run dev
pnpm run test
```

## 🔍 Różnice między npm a pnpm

1. **Lock file**: `package-lock.json` → `pnpm-lock.yaml`
2. **Node modules**: pnpm używa symlinków i deduplikacji
3. **Workspaces**: pnpm używa `pnpm-workspace.yaml` zamiast `package.json` workspaces
4. **Filtrowanie**: `pnpm --filter <package> <command>` zamiast `npm run` w folderze

## 📝 Ważne notatki

- `pnpm-lock.yaml` powinien być commitowany do repo (podobnie jak `package-lock.json`)
- `.pnpm-store/` to cache pnpm - nie powinien być commitowany (już w .gitignore)
- Wszystkie skrypty w `package.json` działają tak samo, ale użyj `pnpm` zamiast `npm`
- pnpm jest szybszy i bardziej efektywny w zarządzaniu zależnościami

## ✅ Checklist migracji

- [ ] Usunięto node_modules i package-lock.json
- [ ] Zainstalowano pnpm
- [ ] Uruchomiono `pnpm install`
- [ ] Zweryfikowano utworzenie pnpm-lock.yaml
- [ ] Przetestowano komendy (seed, start, test)
- [ ] Zaktualizowano dokumentację (README.md)
- [ ] Commit zmian (pnpm-lock.yaml, pnpm-workspace.yaml, .npmrc)

