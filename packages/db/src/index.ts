import { desc, lt } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'
import { createSelectSchema } from 'drizzle-zod'

import { env } from './env'
// biome-ignore lint/performance/noNamespaceImport: <schemas>
import * as schema from './schema'

export const db_schema = schema
const { webhooks } = db_schema

export const db = drizzle(env.DATABASE_URL, { schema, casing: 'snake_case' })

export const WebhookSelectSchema = createSelectSchema(webhooks)

export async function listWebhooksByCursor(limit: number, cursor?: string) {
  return db
    .select({
      id: webhooks.id,
      method: webhooks.method,
      pathname: webhooks.pathname,
      createdAt: webhooks.createdAt,
    })
    .from(webhooks)
    .where(cursor ? lt(webhooks.id, cursor) : undefined)
    .orderBy(desc(webhooks.id))
    .limit(limit + 1)
}
