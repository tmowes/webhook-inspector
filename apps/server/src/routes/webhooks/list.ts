import { listWebhooksByCursor, WebhookSelectSchema } from '@webhook-inspector/db'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks',
    {
      schema: {
        summary: 'List webhooks',
        tags: ['Webhooks'],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
          cursor: z.string().optional(),
        }),
        response: {
          200: z.object({
            webhooks: z.array(
              WebhookSelectSchema.pick({
                id: true,
                method: true,
                pathname: true,
                createdAt: true,
              }),
            ),
            nextCursor: z.string().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { limit, cursor } = request.query
      const result = await listWebhooksByCursor(limit, cursor)
      const hasMore = result.length > limit
      const items = hasMore ? result.slice(0, limit) : result
      const nextCursor = hasMore ? (items.at(-1)?.id ?? null) : null
      return reply.send({ webhooks: items, nextCursor })
    },
  )
}
