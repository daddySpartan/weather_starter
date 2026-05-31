# Agent Commands

Use npm in the workspace root.

## Day-to-day
- Install deps: npm install
- Dev app (backend + frontend via Portless): npm run dev
- Build all: npm run build
- Production run: npm run start

## Test commands
- Preferred on Windows: npm exec vitest run
- Focused route test: npm exec vitest run backend/src/routes/locations.test.ts
- Root npm test uses POSIX env assignment in package.json and can fail on Windows shells.

## Utility commands
- Health/API smoke check: npm run doctor
- Reset local DB: npm run reset
- Drizzle migration generate/apply: npm run db:generate, npm run db:migrate
