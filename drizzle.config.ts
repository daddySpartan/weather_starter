import { defineConfig } from 'drizzle-kit';
import * as process from 'process';

export default defineConfig({
  dialect: 'sqlite',
  schema: './backend/src/schema.ts',
  out: './backend/drizzle',
  dbCredentials: {
    url: process.env.DATABASE_PATH ?? './backend/weather.db',
  },
});
