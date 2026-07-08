// Prisma CLI (unlike `next dev`) does not auto-load .env.local, only .env.
// Load it explicitly here instead of keeping a duplicate .env with live secrets.
process.loadEnvFile('.env.local')

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
