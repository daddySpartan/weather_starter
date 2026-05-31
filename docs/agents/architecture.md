# Architecture Boundaries

## Runtime and serving
- Runtime entrypoint: [backend/src/server.ts](../../backend/src/server.ts)
- Express mounts /api and serves frontend:
  - dev: Vite middleware
  - production: static frontend/dist

## Backend boundaries
- API routes: [backend/src/routes/locations.ts](../../backend/src/routes/locations.ts)
- Persistence layer: [backend/src/db.ts](../../backend/src/db.ts)
- Schema definitions: [backend/src/schema.ts](../../backend/src/schema.ts)
- Weather provider integration: [backend/src/weather.ts](../../backend/src/weather.ts)

## Frontend boundaries
- API client: [frontend/src/api.ts](../../frontend/src/api.ts)
- App state and side effects: [frontend/src/state/store.tsx](../../frontend/src/state/store.tsx)
