import { defineConfig } from 'drizzle-kit';
import ENV from '@/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: ENV.DATABASE_URL,
    ssl: ENV.NODE_ENV === "production"
  },
});
