import { Link } from '@tanstack/react-router'
import { Trash2Icon } from 'lucide-react'

import { CustomCheckbox } from '../ui/checkbox'
import { IconButton } from '../ui/icon-button'

export function WebhooksListItem() {
  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <CustomCheckbox />

        <Link to="/" className="flex min-w-0 flex-1 items-start gap-3">
          <span className="w-12 shrink-0 text-right font-mono font-semibold text-xs text-zinc-300">
            POST
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-zinc-200 leading-tight">
              /video/status
            </p>
            <p className="mt-1 font-medium text-xs text-zinc-500">1 minuto atrás</p>
          </div>
        </Link>

        <IconButton
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  )
}
