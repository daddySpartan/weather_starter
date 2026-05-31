# Backend Conventions

## Route design
- Keep route handlers thin: validate/parse in routes, delegate persistence/provider logic to db/weather modules.
- Preserve typed error behavior:
  - Duplicate location should return HTTP 409.
  - Weather provider failures should map to controlled API responses.

## Data and environment
- Database path is environment-driven via DATABASE_PATH.
- Avoid hard-coding local SQLite paths.
