import { google } from '@ai-sdk/google'
import { getWebhooksByIds } from '@webhook-inspector/db'
import { generateText } from 'ai'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

export const generateHandler: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/generate',
    {
      schema: {
        summary: 'Generate a TypeScript handler',
        tags: ['Webhooks'],
        body: z.object({ webhookIds: z.array(z.string()) }),
        response: { 201: z.object({ code: z.string() }) },
      },
    },
    async (request, reply) => {
      const { webhookIds } = request.body
      const result = await getWebhooksByIds(webhookIds)
      const webhooksBodies = result.map((webhook) => webhook.body).join('\n\n')

      const { text } = await generateText({
        model: google('gemini-2.5-flash'),
        prompt: `
          Generate a TypeScript function that serves as a handler for multiple webhook events. The function should accept a request body containing different webhook events and validate the incoming data using Zod. Each webhook event type should have its own schema defined using Zod.

          The function should handle the following webhook events with example payloads:

          """
          ${webhooksBodies}
          """

          The generated code should include:

          -  A main function that takes the webhook request body as input.
          -  Zod schemas for each event type.
          -  Logic to handle each event based on the validated data.
          -  Appropriate error handling for invalid payloads.

          ---

          You can use this prompt to request the TypeScript code you need for handling webhook events with Zod validation.

          Return only the code and do not return \`\`\`typescript or any other markdown symbols, do not include any introduction or text before or after the code.
        `.trim(),
      })

      return reply.status(201).send({ code: text })
    },
  )
}
