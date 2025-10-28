import { createFileRoute } from '@tanstack/react-router'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { AppSidebar } from '@/components/app-sidebar'
import { SectionDataTable } from '@/components/section/data-table'
import { SectionTitle } from '@/components/section/title'
import { CodeBlock } from '@/components/ui/code-block'
import { WebhookHeaderDetail } from '@/components/webhook/header-detail'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const overviewData = [
    { key: 'Method', value: 'POST' },
    { key: 'Status Code', value: '200' },
    { key: 'Content-Type', value: 'application/json' },
    { key: 'Content-Length', value: '28276 bytes' },
  ]

  return (
    <div className="h-screen bg-zinc-900">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={20} minSize={15} maxSize={40}>
          <AppSidebar />
        </Panel>
        <PanelResizeHandle className="w-px bg-zinc-700 transition-colors duration-150 hover:bg-zinc-600" />
        <Panel defaultSize={80} minSize={60}>
          <div className="flex h-full flex-col">
            <WebhookHeaderDetail />
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-6">
                <div className="space-y-4">
                  <SectionTitle>Request Overview</SectionTitle>
                  <SectionDataTable data={overviewData} />
                </div>

                <div className="space-y-4">
                  <SectionTitle>Query Parameters</SectionTitle>
                  <SectionDataTable data={overviewData} />
                </div>

                <div className="space-y-4">
                  <SectionTitle>Headers</SectionTitle>
                  <SectionDataTable data={overviewData} />
                </div>

                <div className="space-y-4">
                  <SectionTitle>Request Body</SectionTitle>
                  <CodeBlock code={JSON.stringify(overviewData, null, 2)} />
                </div>
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
