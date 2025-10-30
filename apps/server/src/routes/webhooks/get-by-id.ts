import { getWebhookById, WebhookSelectSchema } from '@webhook-inspector/db'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const getWebhook: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Get a specific webhook by ID',
        tags: ['Webhooks'],
        params: z.object({ id: z.uuidv7() }),
        response: {
          200: WebhookSelectSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const result = await getWebhookById(id)
      if (!result) {
        return reply.status(404).send({ message: 'Webhook not found.' })
      }
      return reply.send(result)
    },
  )
}
