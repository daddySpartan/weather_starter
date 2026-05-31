# Testing Patterns

## Runner behavior
- Test config: [vitest.config.ts](../../vitest.config.ts)
- Includes only backend/src/**/*.test.ts.
- Uses node environment and non-parallel file execution.

## API testing pattern
- Use app factory patterns from [backend/src/server.ts](../../backend/src/server.ts).
- Follow route test patterns in [backend/src/routes/locations.test.ts](../../backend/src/routes/locations.test.ts).
