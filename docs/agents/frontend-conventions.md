# Frontend Conventions

## State and side effects
- Keep app-side data flow through [frontend/src/state/store.tsx](../../frontend/src/state/store.tsx).
- Keep API calls centralized through [frontend/src/api.ts](../../frontend/src/api.ts).

## Interaction logging
- Keep frontend interactions logged through /api/logs using existing helpers in [frontend/src/api.ts](../../frontend/src/api.ts).
