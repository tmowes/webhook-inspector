import { defineConfig } from 'drizzle-kit'

import { env } from './src/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: { url: env.DATABASE_URL },
  out: './src/migrations',
  schema: './src/schema/index.ts',
  casing: 'snake_case',
})
