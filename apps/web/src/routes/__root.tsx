import '../index.css'

import { QueryClientProvider } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'

import { AppSidebar } from '@/components/app-sidebar'
import Loader from '@/components/loader'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/libs/query'

// biome-ignore lint/complexity/noBannedTypes: <RouterAppContext temp>
export type RouterAppContext = {}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  head: () => ({
    meta: [
      {
        title: 'webhook-inspector',
      },
      {
        name: 'description',
        content: 'webhook-inspector is a web application',
      },
    ],
    links: [
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  }),
})

function RootComponent() {
  const isFetching = useRouterState({ select: (s) => s.isLoading })

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        disableTransitionOnChange
        storageKey="vite-ui-theme"
      >
        <div className="grid h-svh grid-rows-[auto_1fr]">
          {isFetching ? (
            <Loader />
          ) : (
            <div className="h-screen bg-zinc-900">
              <PanelGroup direction="horizontal">
                <Panel defaultSize={20} minSize={15} maxSize={40}>
                  <AppSidebar />
                </Panel>
                <PanelResizeHandle className="w-px bg-zinc-700 transition-colors duration-150 hover:bg-zinc-600" />
                <Panel defaultSize={80} minSize={60}>
                  <Outlet />
                </Panel>
              </PanelGroup>
            </div>
          )}
        </div>
        <Toaster richColors />
      </ThemeProvider>
    </QueryClientProvider>
  )
}
