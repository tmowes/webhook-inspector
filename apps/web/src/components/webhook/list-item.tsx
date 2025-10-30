import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'
import { Trash2Icon } from 'lucide-react'

import { CustomCheckbox } from '../ui/checkbox'
import { IconButton } from '../ui/icon-button'

type WebhookListItemProps = {
  webhook: {
    id: string
    method: string
    pathname: string
    createdAt: Date
  }
}

export function WebhooksListItem(props: WebhookListItemProps) {
  const { webhook } = props
  const { id, method, pathname, createdAt } = webhook
  const queryClient = useQueryClient()
  const { mutate: deleteWebhook } = useMutation({
    mutationFn: async (webhook_id: string) => {
      await fetch(`http://localhost:3333/api/webhooks/${webhook_id}`, { method: 'DELETE', })
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['webhooks'], }) },
  })

  return (
    <div className="group rounded-lg transition-colors duration-150 hover:bg-zinc-700/30">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <CustomCheckbox />
        <Link to="/webhooks/$id" params={{ id }} className="flex min-w-0 flex-1 items-start gap-3">
          <span className="w-12 shrink-0 text-right font-mono font-semibold text-xs text-zinc-300">
            {method}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-xs text-zinc-200 leading-tight">
              {pathname}
            </p>
            <p className="mt-1 font-medium text-xs text-zinc-500">
              {formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })}
            </p>
          </div>
        </Link>
        <IconButton
          onClick={() => deleteWebhook(id)}
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className="opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
    </div>
  )
}
