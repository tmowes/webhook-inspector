import { desc, eq, type InferInsertModel, inArray, lt } from 'drizzle-orm'
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

export async function getWebhookById(id: string) {
  const [result] = await db.select().from(webhooks).where(eq(webhooks.id, id)).limit(1)
  return result || null
}

export async function deleteWebhookById(id: string) {
  const [result] = await db.delete(webhooks).where(eq(webhooks.id, id)).returning()
  return result || null
}

export async function captureRequest(data: InferInsertModel<typeof webhooks>) {
  const { method, ip, contentType, contentLength, body, headers, pathname } = data

  const [result] = await db
    .insert(webhooks)
    .values({
      method,
      ip,
      contentType,
      contentLength,
      body,
      headers,
      pathname,
    })
    .returning()

  return result || null
}

export async function getWebhooksByIds(webhookIds: string[]) {
  const result = await db
    .select({ body: webhooks.body })
    .from(webhooks)
    .where(inArray(webhooks.id, webhookIds))

  return result
}
