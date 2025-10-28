import { CopyIcon } from 'lucide-react'
import { Suspense } from 'react'

import { ModeToggle } from './theme/mode-toggle'
import { IconButton } from './ui/icon-button'
import { WebhooksList } from './webhook/list'

export function AppSidebar() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-zinc-700 border-b px-4 py-5">
        <div className="flex items-baseline">
          <span className="font-semibold text-zinc-100">webhook</span>
          <span className="font-normal text-zinc-400">.inspect</span>
        </div>
        <ModeToggle />
      </div>

      <div className="flex items-center gap-2 border-zinc-700 border-b bg-zinc-800 px-4 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1 font-mono text-xs text-zinc-300">
          <span className="truncate">http://localhost:3333/api/capture</span>
        </div>
        <IconButton icon={<CopyIcon className="size-4" />} />
      </div>

      <Suspense fallback={<p>Carregando...</p>}>
        <WebhooksList />
      </Suspense>
    </div>
  )
}
