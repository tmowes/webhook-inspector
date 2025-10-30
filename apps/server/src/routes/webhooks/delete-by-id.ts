import { deleteWebhookById } from '@webhook-inspector/db'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const deleteWebhook: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/api/webhooks/:id',
    {
      schema: {
        summary: 'Delete a specific webhook by ID',
        tags: ['Webhooks'],
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          204: z.void(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params
      const result = await deleteWebhookById(id)
      if (!result) {
        return reply.status(404).send({ message: 'Webhook not found.' })
      }
      return reply.status(204).send()
    },
  )
}
