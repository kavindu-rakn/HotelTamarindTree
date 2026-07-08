// Prisma CLI (unlike `next dev`) does not auto-load .env.local, only .env.
// Load it explicitly here instead of keeping a duplicate .env with live secrets.
// Only applies locally — on Vercel (and other CI/hosts) there is no .env.local
// file at all; env vars are injected directly into process.env instead.
import { existsSync } from 'node:fs'

if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
