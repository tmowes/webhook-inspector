import { useSuspenseQuery } from '@tanstack/react-query'

import { webhookDetailsSchema } from '@/http/schemas/webhooks'
import { SectionDataTable } from '../section/data-table'
import { SectionTitle } from '../section/title'
import { CodeBlock } from '../ui/code-block'
import { WebhookHeaderDetail } from './header-detail'

type WebhookDetailsProps = {
  id: string
}

export function WebhookDetails(props: WebhookDetailsProps) {
  const { id } = props
  const { data } = useSuspenseQuery({
    queryKey: ['webhook', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`)
      const result = await response.json()
      return webhookDetailsSchema.parse(result)
    },
  })

  const overviewData = [
    { key: 'Method', value: data.method },
    { key: 'Status Code', value: String(data.statusCode) },
    { key: 'Content-Type', value: data.contentType || 'application/json' },
    { key: 'Content-Length', value: `${data.contentLength || 0} bytes` },
  ]

  const headers = Object.entries(data.headers).map(([key, value]) => ({
    key,
    value: String(value),
  }))

  const queryParams = Object.entries(data.queryParams || {}).map(([key, value]) => ({
    key,
    value: String(value),
  }))

  return (
    <div className="flex h-full flex-col">
      <WebhookHeaderDetail
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={headers} />
          </div>

          {queryParams.length > 0 && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={queryParams} />
            </div>
          )}

          {!!data.body && (
            <div className="space-y-4">
              <SectionTitle>Request Body</SectionTitle>
              <CodeBlock code={data.body} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
