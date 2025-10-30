import { Badge } from '../ui/badge'

type WebhookHeaderDetailProps = {
  ip: string
  method: string
  pathname: string
  createdAt: Date
}

export function WebhookHeaderDetail(props: WebhookHeaderDetailProps) {
  const { ip, method, pathname, createdAt } = props
  return (
    <div className="space-y-4 border-zinc-700 border-b p-6">
      <div className="flex items-center gap-3">
        <Badge>
          {method}
        </Badge>
        <span className="font-medium text-lg text-zinc-300">
          {pathname}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>From IP</span>
          <span className="underline underline-offset-4">
            {ip}
          </span>
        </div>
        <span className="h-4 w-px bg-zinc-700" />
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>em</span>
          <span>
            {createdAt.toLocaleString('pt-BR')}
          </span>
        </div>
      </div>
    </div>
  )
}
